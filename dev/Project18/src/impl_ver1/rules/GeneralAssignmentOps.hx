package impl_ver1.rules;

import game.Balance;
import game.GeneralAssignmentKey;
import game.GeneralAssignmentPreview;
import game.GeneralAssignmentSpec;
import game.GeneralStat;
import game.IGeneral;
import game.StrategyCostTier;

/**
 * Ver1：把「指派武將」的成功率/成本預覽做成可共用的純函數。
 *
 * 設計目標：
 * - 讓資源格加成、事件規避等系統共享同一套輸入/輸出結構
 * - UI 只吃 Preview，不必知道成功率公式細節
 */
class GeneralAssignmentOps {
  /**
   * Ver1：把「指派武將」映射到一個可預覽的成功率。
   * 目前先借用 Balance.strategySuccessRate 的形狀（stat 1~100 + tier + stamina）。
   *
   * TODO(GDD): 若未來資源格加成不需要成功率（一定成功），可讓 successRate 固定 1.0。
   */
  public static function preview(spec:GeneralAssignmentSpec, g:IGeneral, tier:StrategyCostTier, summary:String):GeneralAssignmentPreview {
    var rate = Balance.strategySuccessRate(g.stat(spec.statUsed), tier, g.stamina());
    return {
      kind: spec.kind,
      generalId: spec.generalId,
      statUsed: spec.statUsed,
      staminaCost: spec.staminaCost,
      successRate: rate,
      summary: summary,
    };
  }

  /** 直接用呼叫端算好的 rate 建 preview（用於非 strategySuccessRate 公式）。 */
  public static function previewWithRate(spec:GeneralAssignmentSpec, rate:Float, summary:String):GeneralAssignmentPreview {
    return {
      kind: spec.kind,
      generalId: spec.generalId,
      statUsed: spec.statUsed,
      staminaCost: spec.staminaCost,
      successRate: rate,
      summary: summary,
    };
  }

  /**
   * 便捷：為一整個 roster 生成預覽列。
   * summaryBuilder 由呼叫端決定內容（資源格顯示加成後收益、事件顯示減免比例等）。
   */
  public static function previewForRoster(
    kind:GeneralAssignmentKey,
    roster:Array<IGeneral>,
    statUsed:GeneralStat,
    staminaCost:Int,
    tier:StrategyCostTier,
    summaryBuilder:(g:IGeneral, rate:Float) -> String
  ):Array<GeneralAssignmentPreview> {
    var out:Array<GeneralAssignmentPreview> = [];
    for (g in roster) {
      var spec:GeneralAssignmentSpec = {
        kind: kind,
        generalId: g.id(),
        statUsed: statUsed,
        staminaCost: staminaCost,
      };
      var rate = Balance.strategySuccessRate(g.stat(statUsed), tier, g.stamina());
      out.push({
        kind: kind,
        generalId: g.id(),
        statUsed: statUsed,
        staminaCost: staminaCost,
        successRate: rate,
        summary: summaryBuilder(g, rate),
      });
    }
    return out;
  }

  /**
   * 便捷：為 roster 生成預覽列（由呼叫端提供 rateFn）。
   * 用於村落交易/搶奪/開發等自訂公式。
   */
  public static function previewForRosterWithRate(
    kind:GeneralAssignmentKey,
    roster:Array<IGeneral>,
    statUsed:GeneralStat,
    staminaCost:Int,
    rateFn:(g:IGeneral) -> Float,
    summaryBuilder:(g:IGeneral, rate:Float) -> String
  ):Array<GeneralAssignmentPreview> {
    var out:Array<GeneralAssignmentPreview> = [];
    for (g in roster) {
      var spec:GeneralAssignmentSpec = {
        kind: kind,
        generalId: g.id(),
        statUsed: statUsed,
        staminaCost: staminaCost,
      };
      var rate = rateFn(g);
      out.push(previewWithRate(spec, rate, summaryBuilder(g, rate)));
    }
    return out;
  }
}

