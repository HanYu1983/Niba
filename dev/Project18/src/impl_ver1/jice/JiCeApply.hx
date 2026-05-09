package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.GeneralStat;
import game.GameError;
import game.MenuFormWidget;
import game.PositionRank;
import game.StrategyCostTier;
import game.StrategyPhase;
import game.PopupPayload;
import impl_ver1.core.GameMatchCore;
import impl_ver1.util.Deterministic;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * Ver1：計策（JiCe）共用的表單解析與施放流程小工具。
 * 目的：讓各張牌避免重複寫「單選武將/目標」與「成功率/扣體力」樣板碼。
 */
class JiCeApply {
  public static function phaseLabel(p:Null<StrategyPhase>):String {
    return switch p {
      case PreMove: "移動前";
      case PostMove: "移動後";
      case null: "（未知）";
    };
  }

  public static function tierLabel(t:StrategyCostTier):String {
    return switch t {
      case Low: "低";
      case Medium: "中";
      case High: "高";
    };
  }

  public static function statLabel(s:GeneralStat):String {
    return switch s {
      case Command: "統御";
      case Might: "武力";
      case Wit: "智謀";
      case Stewardship: "政治";
    };
  }

  public static function pct(v:Float):Int
    return Std.int(Math.floor(v * 100));

  public static function readSingleGeneralId(w:MenuFormWidget, ctx:String, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw ctx + ': ' + label + " must pick exactly 1 general";
        sel[0];
      default:
        throw ctx + ': ' + label + " widget must be GeneralMultiPick";
    };
  }

  public static function readSingleMonarchId(w:MenuFormWidget, ctx:String, label:String):MonarchId {
    return switch w {
      case MonarchSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw ctx + ': ' + label + " must pick exactly 1 monarch";
        selected[0];
      default:
        throw ctx + ': ' + label + " widget must be MonarchSinglePick";
    };
  }

  public static function readSingleTileIndex(w:MenuFormWidget, ctx:String, label:String):TileIndex {
    return switch w {
      case TileSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw ctx + ': ' + label + " must pick exactly 1 tile";
        selected[0];
      default:
        throw ctx + ': ' + label + " widget must be TileSinglePick";
    };
  }

  public static function requireCaster(ruler:Monarch, casterId:GeneralId, ctx:String):General {
    for (g in ruler.roster())
      if (g != null && g.id() == casterId)
        return cast g;
    throw ctx + ': caster not in roster';
  }

  /** docs/策略系統.md：部分策略需達到職位才可使用（UI 應過濾；此處再做硬檢查）。 */
  public static function requireCasterRank(caster:General, required:PositionRank, ctx:String):Void {
    if (!Balance.positionRankGte(caster.positionRank(), required))
      throw new GameError(
        "武將職位不足（需要 " + Std.string(required) + "）。",
        "不可使用策略",
        ctx + "/insufficient-rank"
      );
  }

  /**
   * 套用策略成功率並扣體力（固定：不論成功與否都扣）。
   * 回傳此次擲骰與消耗結果（deterministic，利於測試重現）。
   */
  public static function rollAndConsumeStamina(
    match:GameMatchCore,
    caster:General,
    stat:GeneralStat,
    tier:StrategyCostTier,
    seed:String
  ):{ok:Bool, rate:Float, roll:Float, cost:Int, before:Int, after:Int} {
    var before = caster.stamina();
    var rate = Balance.strategySuccessRate(caster.stat(stat), tier, before);
    var roll = Deterministic.hash01(seed);
    var ok = roll < rate;
    // docs/數值算法.md §1.4：策略體力消耗採區間抽樣（deterministic）
    var costU = Deterministic.hash01(seed + "|cost");
    var cost = Balance.rollStrategyStaminaCost(tier, costU);
    caster.setStamina(Balance.clampInt(before - cost, 0, 100));
    var after = caster.stamina();
    // docs/數值算法.md §10.1：策略成功 → 功績 +10
    if (ok)
      caster.grantMerit(10);
    return {ok: ok, rate: rate, roll: roll, cost: cost, before: before, after: after};
  }

  /**
   * 計策通用彈窗（施放方）。
   * - 失敗也顯示（避免玩家以為沒按到）
   * - 目標與效果摘要由呼叫端傳入
   */
  public static function popupCaster(
    match:GameMatchCore,
    actorId:MonarchId,
    cardLabel:String,
    phase:Null<StrategyPhase>,
    casterId:GeneralId,
    stat:GeneralStat,
    tier:StrategyCostTier,
    roll:{ok:Bool, rate:Float, roll:Float, cost:Int, before:Int, after:Int},
    targetLine:String,
    effectLines:Array<String>,
    ctxKey:String
  ):Void {
    var title = '計策：${cardLabel}（' + (roll.ok ? "成功" : "失敗") + "）";
    var fx = effectLines != null ? effectLines.copy() : [];
    var tgt:Null<String> = (targetLine != null && targetLine.length > 0) ? targetLine : null;
    match.pushOutboxPlain(
      actorId,
      title,
      PopupPayload.JiCeCasterOutcome(
        cardLabel,
        phase,
        casterId,
        stat,
        tier,
        roll.ok,
        roll.rate,
        roll.roll,
        roll.cost,
        roll.before,
        roll.after,
        tgt,
        fx
      ),
      ctxKey
    );
  }

  /** 計策通用彈窗（受影響方；若沒有目標玩家可略）。 */
  public static function popupTargetMonarch(
    match:GameMatchCore,
    targetMonarchId:MonarchId,
    cardLabel:String,
    attackerMonarchId:MonarchId,
    casterId:GeneralId,
    effectLines:Array<String>,
    ctxKey:String
  ):Void {
    var title = '遭遇計策：${cardLabel}';
    var fx = effectLines != null ? effectLines.copy() : [];
    match.pushOutboxPlain(targetMonarchId, title, PopupPayload.JiCeTargetOutcome(cardLabel, attackerMonarchId, casterId, fx), ctxKey);
  }
}

