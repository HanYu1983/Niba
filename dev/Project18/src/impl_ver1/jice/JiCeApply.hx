package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.GeneralStat;
import game.MenuFormWidget;
import game.StrategyCostTier;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * Ver1：計策（JiCe）共用的表單解析與施放流程小工具。
 * 目的：讓各張牌避免重複寫「單選武將/目標」與「成功率/扣體力」樣板碼。
 */
class JiCeApply {
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

  /**
   * 套用策略成功率並扣體力（固定：不論成功與否都扣）。
   * 回傳此次是否成功。
   */
  public static function rollAndConsumeStamina(caster:General, stat:GeneralStat, tier:StrategyCostTier):Bool {
    var rate = Balance.strategySuccessRate(caster.stat(stat), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));
    return ok;
  }
}

