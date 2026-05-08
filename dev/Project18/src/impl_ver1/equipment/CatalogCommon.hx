package impl_ver1.equipment;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;
import impl_ver1.model.Equipment;
import impl_ver1.util.Deterministic;

/**
 * 共用：多種裝備 catalog 的樣板查找、浮動（±10%）、價格規則。
 * 各 catalog 僅提供 templates 與 (type, bonusStat) 對應即可。
 */
class CatalogCommon {
  public static function allNames(templates:Array<EquipmentTemplate>):Array<String> {
    var out:Array<String> = [];
    for (t in templates)
      out.push(t.name);
    return out;
  }

  public static function spawnByName(
    catalogName:String,
    templates:Array<EquipmentTemplate>,
    id:EquipmentId,
    name:String,
    type:EquipmentType,
    bonusStat:GeneralStat,
    ?price:Int
  ):IEquipment {
    var t = findTemplate(catalogName, templates, name);
    var v = applyJitter(t.rarity, t.baseBonus, id);
    var p = price != null ? price : defaultPrice(t.rarity, v);
    return new Equipment(id, t.name, type, t.rarity, bonusStat, v, t.loyaltyBonus, p);
  }

  static function findTemplate(catalogName:String, templates:Array<EquipmentTemplate>, name:String):EquipmentTemplate {
    for (t in templates)
      if (t.name == name)
        return t;
    throw catalogName + ': unknown item name "' + name + '"';
  }

  /**
   * 同名裝備加成浮動（±10%），由 id 決定，確保可重現。
   * 對齊 docs/數值算法.md §8.1：依稀有度將最終值 clamp 在範圍內。
   */
  static function applyJitter(r:Rarity, baseBonus:Int, id:EquipmentId):Int {
    var f = Deterministic.jitter(id, 0.1); // [-0.1, 0.1]
    var v = Std.int(Math.round(baseBonus * (1.0 + f)));
    if (v < 1)
      v = 1;
    var lo = switch r {
      case Common: 5;
      case Fine: 10;
      case Epic: 20;
      case Legendary: 35;
    };
    var hi = switch r {
      case Common: 10;
      case Fine: 20;
      case Epic: 35;
      case Legendary: 50;
    };
    if (v < lo)
      v = lo;
    if (v > hi)
      v = hi;
    return v;
  }

  static function defaultPrice(r:Rarity, bonusValue:Int):Int {
    var tier = switch r {
      case Common: 100;
      case Fine: 300;
      case Epic: 800;
      case Legendary: 2000;
    };
    // 以加成幅度做線性放大（避免同稀有度價格都一樣）
    return tier + bonusValue * 10;
  }

  // hash/jitter 的底層實作統一由 Deterministic 提供（避免多處複製造成規則漂移）。
}

typedef EquipmentTemplate = {
  name:String,
  rarity:Rarity,
  baseBonus:Int,
  loyaltyBonus:Int,
};

