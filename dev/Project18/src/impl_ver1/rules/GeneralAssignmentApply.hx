package impl_ver1.rules;

import game.Balance;
import game.GameIds;
import game.MenuFormWidget;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * Ver1：指派武將的共用套用工具（解析選將、驗證麾下、扣體力）。
 * 目的：避免每個 staging action 重複寫一套「從 widgets 撈 generalId」與「扣體力」。
 */
class GeneralAssignmentApply {
  /** 從表單 widgets 的第一個 GeneralMultiPick 取「去重後第一個」generalId（視為單選）。 */
  public static function pickSingleGeneralId(widgets:Array<MenuFormWidget>):GeneralId {
    var picked:Array<String> = [];
    for (w in widgets)
      switch w {
        case GeneralMultiPick(_, _, sel):
          picked = sel.copy();
        default:
      }
    var gid:Null<GeneralId> = null;
    var seen = new Map<String, Bool>();
    for (id in picked) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      gid = id;
      break;
    }
    if (gid == null)
      throw "GeneralAssignmentApply: must pick a general";
    return gid;
  }

  /** 要求 gid 為 ruler roster 成員並回傳具象 General。 */
  public static function requireOwnedGeneral(ruler:Monarch, gid:GeneralId):General {
    for (g in ruler.roster())
      if (g != null && g.id() == gid)
        return cast g;
    throw 'GeneralAssignmentApply: picked general not in roster: "$gid"';
  }

  /** 扣除體力並 clamp 到 [0,100]。 */
  public static function applyStaminaCost(g:General, cost:Int):Void {
    if (cost < 0)
      throw "GeneralAssignmentApply: stamina cost negative";
    g.setStamina(Balance.clampInt(g.stamina() - cost, 0, 100));
  }
}

