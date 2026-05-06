package impl_ver1.rules;

import game.GameIds;
import game.MovementStepOutcome;
import game.IPlayer;
import game.IPlayerMenuNode;
import game.Balance;
import game.GeneralStat;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;

/**
 * Ver1 規剘：終局、移動（逐步前進並呼叫 {@link game.IJiCeMovementStepHook}）、進駐／調度數值；敵城對峙戰果套用鉤子。
 * 落地分流與敵城 pending／結算文案組字由 {@link GameMatchCore} 私有方法集中管理；此地僅呼叫已暴露之私有行為（同套件）。
 */
class GameMatchVer1Ops {
  public static function evaluateTermination(m:GameMatchCore):Void {}

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
      // 起點獎勵：若格子類型為 Start 則觸發；為相容既有關卡，索引 0 仍視為起點（直到全面換成 Start）。
      var k = m.tileAt(landIdx).kind();
      if (k == Start || landIdx == 0)
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
    maxTroopSlider:Int,
    maxGrainSlider:Int,
    defTroop:Int,
    defGrain:Int,
  } {
    var cityTroop = m.forceGetCityStoredTroops(tileIndex);
    var cityGrain = m.forceGetCityStoredGrain(tileIndex);
    var maxTroopSlider = ruler.troops();
    var maxGrainSlider = ruler.grain();
    return {
      cityTroop: cityTroop,
      cityGrain: cityGrain,
      maxTroopSlider: maxTroopSlider,
      maxGrainSlider: maxGrainSlider,
      defTroop: clampInt(cityTroop, 0, maxTroopSlider),
      defGrain: clampInt(cityGrain, 0, maxGrainSlider),
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
    targetGrain:Int
  ):Void {
    var oldT = m.forceGetCityStoredTroops(tileIndex);
    var oldG = m.forceGetCityStoredGrain(tileIndex);
    var dT = targetTroops - oldT;
    var dG = targetGrain - oldG;
    if (dT > 0)
      ruler.reduceTroops(dT);
    else if (dT < 0)
      ruler.grantTroops(-dT);
    if (dG > 0)
      ruler.reduceGrain(dG);
    else if (dG < 0)
      ruler.grantGrain(-dG);
    m.cityMapsApplyFriendlyDispatchTargets(tileIndex, targetTroops, targetGrain);
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
    var idx = m.forceGetPendingHostileCityTile();
    if (idx == null)
      return;
    var tok = m.forceGetHostileCityAttackerChoiceToken();
    if (tok == null)
      return;
    // 目前僅把「攻城戰」接成真結算線，其他選項仍保留流程骨架。
    if (tok != "siege")
      return;

    var atkId = m.forceGetHostileCityAttackerId();
    var defId = m.forceGetHostileCityDefenderId();
    if (atkId == null || defId == null)
      return;

    var atkMon = cast(m.monarchById(atkId), Monarch);
    var defCityTroops = m.forceGetCityStoredTroops(idx);
    var level = m.forceGetCityLevel(idx);
    var cityBonus = Balance.cityDefenseBonus(level);

    // 攻城投入：最多 500，若不足則投入現有兵力
    var commit = Std.int(Math.min(500, atkMon.troops()));
    if (commit <= 0)
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

    var atkPower = commit * ((gAtk.stat(Might) / 100.0) + (gAtk.stat(Command) / 100.0) * 0.5) * Balance.staminaModifier(gAtk.stamina());
    var defPower = defCityTroops * 0.8 * cityBonus; // 骨架：守城以 city stored troops 為主
    var win = atkPower > defPower;

    if (win) {
      // 攻方投入損耗 20%
      atkMon.reduceTroops(Std.int(Math.floor(commit * 0.2)));
      // 城池易主，並削減城池駐軍（骨架：-30%）
      var newTroops = Std.int(Math.floor(defCityTroops * 0.7));
      m.forcePutCityStores(idx, newTroops, m.forceGetCityStoredGrain(idx));
      m.forceSetCityOwner(idx, atkId);
    } else {
      // 攻方失敗：投入損耗 50%
      atkMon.reduceTroops(Std.int(Math.floor(commit * 0.5)));
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
