package impl_ver1.rules;

import game.GameIds;
import game.MovementStepOutcome;
import game.IPlayer;
import game.IPlayerMenuNode;
import game.Balance;
import game.GeneralStat;
import game.MatchTerminationReason;
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.util.Deterministic;

/**
 * Ver1 規剘：終局、移動（逐步前進並呼叫 {@link game.IJiCeMovementStepHook}）、進駐／調度數值；敵城對峙戰果套用鉤子。
 * 落地分流與敵城 pending／結算文案組字由 {@link GameMatchCore} 私有方法集中管理；此地僅呼叫已暴露之私有行為（同套件）。
 */
class GameMatchVer1Ops {
  public static inline var TIME_LIMIT_ROUNDS:Int = 100;
  public static inline var WEALTH_VICTORY_THRESHOLD:Int = 100000;

  /**
   * GDD 2.4 勝利條件（ver1 最短對齊）：
   * - 征服勝利：僅剩 1 名「總兵力」> 0 的君主
   * - 領土勝利：佔領 > 1/2 城池格
   * - 財富勝利：總金錢 >= 門檻（暫用 100000）
   *
   * 時限勝利：回合數達上限（暫定 100）→ 以綜合評分最高者勝；同分為平局。
   *
   * 優先序：征服 > 領土 > 財富（同一 tick 只會產生一個終局原因）。
   */
  public static function evaluateTermination(m:GameMatchCore):Void {
    // 已終局則不重算
    switch m.getTerminationReason() {
      case NotEnded:
      case _:
        return;
    }

    var mons = m.monarchs();

    // 1) 征服勝利：僅剩 1 名總兵力 > 0
    var alive:Array<MonarchId> = [];
    for (x in mons) {
      var mid = x.id();
      if (totalTroops(m, mid) > 0)
        alive.push(mid);
    }
    if (alive.length == 1) {
      m.assignTerminationReason(Victory(alive[0]));
      return;
    }
    if (alive.length == 0) {
      m.assignTerminationReason(Draw);
      return;
    }

    // 0) 時限勝利：回合數達上限 → 比分數
    if (m.roundNumber() >= TIME_LIMIT_ROUNDS) {
      var bestScore:Null<{mid:MonarchId, score:Int}> = null;
      for (x in mons) {
        var mid = x.id();
        var s = scoreOfMonarch(m, mid);
        if (bestScore == null || s > bestScore.score) {
          bestScore = {mid: mid, score: s};
        }
      }
      if (bestScore == null) {
        m.assignTerminationReason(Draw);
        return;
      }
      // 同分處理：ver1 暫定「並列不和局」，維持先出現者（seat/monarchs() 順序）為勝方
      m.assignTerminationReason(Victory(bestScore.mid));
      return;
    }

    // 2) 領土勝利：佔領 > 1/2 城池格
    var cityTotal = 0;
    var cityOwned = new Map<MonarchId, Int>();
    for (x in mons)
      cityOwned.set(x.id(), 0);
    var n = m.board().length();
    for (i in 0...n) {
      if (m.tileAt(i).kind() != City)
        continue;
      cityTotal++;
      var owner = m.forceGetCityOwner(i);
      if (owner != null) {
        var prev = cityOwned.exists(owner) ? cityOwned.get(owner) : 0;
        cityOwned.set(owner, prev + 1);
      }
    }
    if (cityTotal > 0) {
      for (x in mons) {
        var mid = x.id();
        var owned = cityOwned.get(mid);
        if (owned > cityTotal / 2) {
          m.assignTerminationReason(Victory(mid));
          return;
        }
      }
    }

    // 3) 財富勝利：總金錢（君主金 + 領地金）達門檻
    var best:Null<{mid:MonarchId, gold:Int}> = null;
    var tied = false;
    for (x in mons) {
      var mid = x.id();
      var g = totalGold(m, mid);
      if (g >= WEALTH_VICTORY_THRESHOLD) {
        if (best == null || g > best.gold) {
          best = {mid: mid, gold: g};
          tied = false;
        } else if (best != null && g == best.gold) {
          tied = true;
        }
      }
    }
    if (best != null) {
      m.assignTerminationReason(tied ? Draw : Victory(best.mid));
      return;
    }
  }

  /**
   * 時限勝利評分（暫定 ver1 隨意算法，先可用即可）：
   * - 君主金錢（含領地存金）每 10 金 = 1 分
   * - 總兵力（含領地儲兵）每 10 兵 = 1 分
   * - 每座城池 +100 分
   * - 每座村落 +50 分
   */
  public static function scoreOfMonarch(m:GameMatchCore, mid:MonarchId):Int {
    var gold = totalGold(m, mid);
    var troops = totalTroops(m, mid);
    var cities = countOwnedCities(m, mid);
    var villages = countOwnedVillages(m, mid);
    var s = Std.int(gold / 10) + Std.int(troops / 10) + cities * 100 + villages * 50;
    if (s < 0)
      s = 0;
    return s;
  }

  static function totalTroops(m:GameMatchCore, mid:MonarchId):Int {
    var mon = cast(m.monarchById(mid), Monarch);
    var sum = mon.troops();
    if (sum < 0)
      sum = 0;
    var n = m.board().length();
    for (i in 0...n) {
      switch m.tileAt(i).kind() {
        case City:
          if (m.forceGetCityOwner(i) == mid)
            sum += nonNeg(m.forceGetCityStoredTroops(i));
        case Village:
          if (m.forceGetVillageOwner(i) == mid)
            sum += nonNeg(m.forceGetVillageStoredTroops(i));
        default:
      }
    }
    return sum;
  }

  static function totalGold(m:GameMatchCore, mid:MonarchId):Int {
    var mon = cast(m.monarchById(mid), Monarch);
    var sum = mon.gold();
    if (sum < 0)
      sum = 0;
    var n = m.board().length();
    for (i in 0...n) {
      switch m.tileAt(i).kind() {
        case City:
          if (m.forceGetCityOwner(i) == mid)
            sum += nonNeg(m.forceGetCityStoredGold(i));
        case Village:
          if (m.forceGetVillageOwner(i) == mid)
            sum += nonNeg(m.forceGetVillageStoredGold(i));
        default:
      }
    }
    return sum;
  }

  static function countOwnedCities(m:GameMatchCore, mid:MonarchId):Int {
    var n = m.board().length();
    var c = 0;
    for (i in 0...n)
      if (m.tileAt(i).kind() == City && m.forceGetCityOwner(i) == mid)
        c++;
    return c;
  }

  static function countOwnedVillages(m:GameMatchCore, mid:MonarchId):Int {
    var n = m.board().length();
    var c = 0;
    for (i in 0...n)
      if (m.tileAt(i).kind() == Village && m.forceGetVillageOwner(i) == mid)
        c++;
    return c;
  }

  static inline function nonNeg(x:Int):Int {
    return x < 0 ? 0 : x;
  }

  /**
   * 移動：依計畫步數逐一 {@link Monarch#advanceOnBoard(1, ringLen)}，每步落地後依序呼叫
   * {@link game.IGameMatch#movementStepHooks} 快照；任一勾子回 {@link MovementStepOutcome.HaltRemainingSteps}
   * 則不再消費後續步數。最後統一 {@link GameMatchCore#settleAfterMoveLanding}（與「一步走完 δ」語意相容）。
   */
  public static function applyMenuLeafForMove(m:GameMatchCore, actor:IPlayer):Void {
    var ruler = cast(m.activeMonarch(), Monarch);
    var ringLen = m.board().length();
    var planned = m.rollMoveDelta();
    var stepOrdinal = 0;
    while (stepOrdinal < planned) {
      ruler.advanceOnBoard(1, ringLen);
      stepOrdinal++;
      var landIdx = ruler.pawnIndex();
      // 起點獎勵：僅在格子類型為 Start 時觸發（GDD 2.1.12）
      var k = m.tileAt(landIdx).kind();
      if (k == Start)
        m.onPassStartTile(ruler);
      var hooks = m.movementStepHooks();
      var halt = false;
      for (h in hooks) {
        switch h.onMovementStepAfterLand(m, actor, stepOrdinal, planned, landIdx) {
          case Continue:
          case HaltRemainingSteps:
            halt = true;
        }
      }
      if (halt)
        break;
    }
    m.settleAfterMoveLanding();
  }

  /** 我方城池調度表單：城池現狀、君主池上限與預設滑桿位置（規剘可改上限語意）。 */
  public static function friendlyCityDispatchSliderDefaults(m:GameMatchCore, tileIndex:TileIndex, ruler:Monarch):{
    cityTroop:Int,
    cityGrain:Int,
    cityGold:Int,
    maxTroopSlider:Int,
    maxGrainSlider:Int,
    maxGoldSlider:Int,
    defTroop:Int,
    defGrain:Int,
    defGold:Int,
  } {
    var cityTroop = m.forceGetCityStoredTroops(tileIndex);
    var cityGrain = m.forceGetCityStoredGrain(tileIndex);
    var cityGold = m.forceGetCityStoredGold(tileIndex);
    var maxTroopSlider = ruler.troops();
    var maxGrainSlider = ruler.grain();
    var maxGoldSlider = ruler.gold();
    return {
      cityTroop: cityTroop,
      cityGrain: cityGrain,
      cityGold: cityGold,
      maxTroopSlider: maxTroopSlider,
      maxGrainSlider: maxGrainSlider,
      maxGoldSlider: maxGoldSlider,
      defTroop: clampInt(cityTroop, 0, maxTroopSlider),
      defGrain: clampInt(cityGrain, 0, maxGrainSlider),
      defGold: clampInt(cityGold, 0, maxGoldSlider),
    };
  }

  /**
   * 空城進駐確認：自君主池扣除並累計至城池儲備，設置屬主與駐軍列表。
   * 呼叫前 {@link GameMatchCore} 應已完成表單解析與資源邊界 assert。
   */
  public static function applyEmptyCityOccupySubmit(
    m:GameMatchCore,
    tileIndex:TileIndex,
    ruler:Monarch,
    troops:Int,
    grain:Int,
    garrisonIds:Array<GeneralId>
  ):Void {
    ruler.reduceTroops(troops);
    ruler.reduceGrain(grain);
    m.cityMapsDepositOccupy(tileIndex, ruler.id(), troops, grain, garrisonIds);
  }

  /** 進駐取消：無資源效果（預留未來紀錄／統計）。 */
  public static function onEmptyCityOccupyAbort(m:GameMatchCore):Void {}

  /**
   * 我方城池調度：城池兵力／糧食目標與君主池同步（差額進出）。
   */
  public static function applyFriendlyCityDispatch(
    m:GameMatchCore,
    tileIndex:TileIndex,
    ruler:Monarch,
    targetTroops:Int,
    targetGrain:Int,
    targetGold:Int
  ):Void {
    var oldT = m.forceGetCityStoredTroops(tileIndex);
    var oldG = m.forceGetCityStoredGrain(tileIndex);
    var oldGold = m.forceGetCityStoredGold(tileIndex);
    var dT = targetTroops - oldT;
    var dG = targetGrain - oldG;
    var dGold = targetGold - oldGold;
    if (dT > 0)
      ruler.reduceTroops(dT);
    else if (dT < 0)
      ruler.grantTroops(-dT);
    if (dG > 0)
      ruler.reduceGrain(dG);
    else if (dG < 0)
      ruler.grantGrain(-dG);
    if (dGold > 0)
      ruler.reduceGold(dGold);
    else if (dGold < 0)
      ruler.grantGold(-dGold);
    m.cityMapsApplyFriendlyDispatchTargets(tileIndex, targetTroops, targetGrain);
    m.forcePutCityStoredGold(tileIndex, targetGold);
  }

  /** 結束拜訪城池（預留事件／音效鉤子）。 */
  public static function onFriendlyCityVisitEnd(m:GameMatchCore):Void {}

  /** 攻方敵城選項已確認（過路費試算、談判旗標等可在此擴充）。 */
  public static function onHostileCityAttackerConfirmed(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 守方非單挑確認後鉤子（士氣／AI 反應等）。 */
  public static function onHostileCityDefenderAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 守方單挑應戰武將確定後鉤子（決鬥預覽数值）。 */
  public static function onHostileCityDefenderDuelPickConfirmed(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 攻方確認結算後套用實際戰果（扣糧、易主、駐軍損耗等）；呼叫時仍可讀 pending 暫存。 */
  public static function applyHostileCitySettlementAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // NOTE(num-algo): ver1「攻城戰」以 docs/數值算法.md §3 的形狀落地（含 0.85~1.15 隨機係數與城防加成）。
    // 城池不含友好度修正（該修正用於村落/攻占），並保留後續擴充空間（駐防設施/計策防禦等）。
    var idx = m.forceGetPendingHostileCityTile();
    if (idx == null)
      return;
    var tok = m.forceGetHostileCityAttackerChoiceToken();
    if (tok == null)
      return;
    // ver1：先落地「消耗戰(搶奪)」與「攻城戰」兩條真結算線；其餘選項保留流程骨架。
    if (tok != "siege" && tok != "attrition")
      return;

    var atkId = m.forceGetHostileCityAttackerId();
    var defId = m.forceGetHostileCityDefenderId();
    if (atkId == null || defId == null)
      return;

    var atkMon = cast(m.monarchById(atkId), Monarch);
    var defCityTroops = m.forceGetCityStoredTroops(idx);
    var level = m.forceGetCityLevel(idx);
    var cityBonus = Balance.cityDefenseBonus(level);

    // 攻方投入：最多 500，若不足則投入現有兵力
    var commitAtk = Std.int(Math.min(500, atkMon.troops()));
    if (commitAtk <= 0)
      return;

    // 取攻方選擇武將（應恰好一名）
    var gid = m.forceGetHostileCityAttackerGeneralId();
    var gAtk:Null<General> = null;
    for (g in atkMon.roster())
      if (g.id() == gid) {
        gAtk = cast g;
        break;
      }
    if (gAtk == null)
      return;

    // docs/數值算法.md 2.2/3.2：戰力 = 士兵數 × (武力係數 + 統率係數) × 體力修正 ×（城防加成）× 隨機係數
    var atkBase = commitAtk * ((gAtk.stat(Might) / 100.0) + (gAtk.stat(Command) / 100.0) * 0.5) * Balance.staminaModifier(gAtk.stamina());

    // 守方武將：優先用「守方單挑選將」（必為駐守）；否則以駐守第一名；再不然用 0.8 係數的骨架
    var defGid = m._hostileCityDefenderGeneralId;
    if (defGid == null) {
      var gs = m.forceGetCityGarrisonGeneralIds(idx);
      if (gs.length > 0)
        defGid = gs[0];
    }
    var defBase:Float = 0;
    if (defGid != null) {
      // 由君主 roster 尋找武將（避免引入新的 core API）
      var gDef:Null<General> = null;
      for (mm in m.monarchs()) {
        var mon = cast(mm, Monarch);
        for (gg in mon.roster())
          if (gg.id() == defGid) {
            gDef = cast gg;
            break;
          }
        if (gDef != null)
          break;
      }
      if (gDef != null) {
        defBase = defCityTroops * ((gDef.stat(Might) / 100.0) + (gDef.stat(Command) / 100.0) * 0.5) * Balance.staminaModifier(gDef.stamina()) * cityBonus;
      } else {
        defBase = defCityTroops * 0.8 * cityBonus;
      }
    } else {
      defBase = defCityTroops * 0.8 * cityBonus;
    }

    var seed = 'hostile_city_${tok}|t=${idx}|r=${m.roundNumber()}|atk=${atkId}|def=${defId}|g=${gid}|c=${commitAtk}';
    var atkRand = 0.85 + impl_ver1.util.Deterministic.hash01(seed + "|atk") * 0.30;
    var defRand = 0.85 + impl_ver1.util.Deterministic.hash01(seed + "|def") * 0.30;
    var win = (atkBase * atkRand) > (defBase * defRand);

    // === A) 消耗戰（搶奪）：docs/數值算法.md §2（500 vs 500，不改變所有權）===
    if (tok == "attrition") {
      var commitDef = Std.int(Math.min(500, defCityTroops));
      if (commitDef <= 0)
        return;
      // 防守戰力依 §2.2：帶城防加成（以城池等級），並加隨機係數
      var atkPow = atkBase * atkRand;
      var defPow = defBase * defRand;
      if (atkPow > defPow) {
        // 獲取敵方領地資源：比例 = (atk-def)/atk * 50%
        var ratio = ((atkPow - defPow) / atkPow) * 0.50;
        if (ratio < 0)
          ratio = 0;
        if (ratio > 0.50)
          ratio = 0.50;
        var prevGold = m.forceGetCityStoredGold(idx);
        var prevGrain = m.forceGetCityStoredGrain(idx);
        var prevTroops = m.forceGetCityStoredTroops(idx);
        var lootGold = Std.int(Math.floor(prevGold * ratio));
        var lootGrain = Std.int(Math.floor(prevGrain * ratio));
        var lootTroops = Std.int(Math.floor(prevTroops * ratio));
        if (lootGold > 0)
          atkMon.grantGold(lootGold);
        if (lootGrain > 0)
          atkMon.grantGrain(lootGrain);
        if (lootTroops > 0)
          atkMon.grantTroops(lootTroops);
        m.forcePutCityStoredGold(idx, prevGold - lootGold);
        m.forcePutCityStores(idx, prevTroops - lootTroops, prevGrain - lootGrain);
      } else {
        // 攻方損失：損失比例 = (def-atk)/def * 30%
        var ratio = ((defPow - atkPow) / defPow) * 0.30;
        if (ratio < 0)
          ratio = 0;
        if (ratio > 0.30)
          ratio = 0.30;
        var loss = Std.int(Math.floor(commitAtk * ratio));
        if (loss > 0)
          atkMon.reduceTroops(loss);
      }
      return;
    }

    // === B) 攻城戰：docs/數值算法.md §3（易主 + 掠奪 30%）===
    if (win) {
      // 攻占成功：城池易主；掠奪儲備 30%
      atkMon.reduceTroops(commitAtk);

      var prevGold = m.forceGetCityStoredGold(idx);
      var prevGrain = m.forceGetCityStoredGrain(idx);
      var prevTroops = m.forceGetCityStoredTroops(idx);
      var lootGold = Std.int(Math.floor(prevGold * 0.30));
      var lootGrain = Std.int(Math.floor(prevGrain * 0.30));
      var lootTroops = Std.int(Math.floor(prevTroops * 0.30));
      if (lootGold > 0)
        atkMon.grantGold(lootGold);
      if (lootGrain > 0)
        atkMon.grantGrain(lootGrain);
      if (lootTroops > 0)
        atkMon.grantTroops(lootTroops);

      m.forcePutCityStoredGold(idx, prevGold - lootGold);
      m.forcePutCityStores(idx, prevTroops - lootTroops, prevGrain - lootGrain);
      m.forceSetCityOwner(idx, atkId);
    } else {
      // 攻占失敗：投入士兵損失 20%（docs/數值算法.md 3.3）
      var loss = Std.int(Math.floor(commitAtk * 0.20));
      if (loss > 0)
        atkMon.reduceTroops(loss);
    }
  }

  static function clampInt(v:Int, lo:Int, hi:Int):Int {
    if (v < lo)
      return lo;
    if (v > hi)
      return hi;
    return v;
  }
}
