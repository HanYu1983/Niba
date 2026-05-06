package impl_ver1.equipment;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;
import impl_ver1.model.Equipment;

/** docs/裝備系統.md：防具清單（統率/Command 加成）與忠誠提升。 */
class ArmorCatalog {
  static final templates:Array<ArmorTemplate> = [
    // 普通
    {name: "皮甲", rarity: Common, baseBonus: 5, loyaltyBonus: 5},
    {name: "鐵甲", rarity: Common, baseBonus: 8, loyaltyBonus: 5},
    // 精良
    {name: "當世具足", rarity: Fine, baseBonus: 15, loyaltyBonus: 10},
    // 史詩
    {name: "明光鎧", rarity: Epic, baseBonus: 25, loyaltyBonus: 15},
    {name: "山文甲", rarity: Epic, baseBonus: 28, loyaltyBonus: 15},
    // 傳說
    {name: "龍鱗鎧", rarity: Legendary, baseBonus: 40, loyaltyBonus: 20},
  ];

  public static function allNames():Array<String> {
    var out:Array<String> = [];
    for (t in templates)
      out.push(t.name);
    return out;
  }

  public static function spawnByName(id:EquipmentId, name:String, ?price:Int):IEquipment {
    var t = findTemplate(name);
    var v = applyJitter(t.baseBonus, id);
    var p = price != null ? price : defaultPrice(t.rarity, v);
    return new Equipment(id, t.name, Armor, t.rarity, Command, v, t.loyaltyBonus, p);
  }

  static function findTemplate(name:String):ArmorTemplate {
    for (t in templates)
      if (t.name == name)
        return t;
    throw 'ArmorCatalog: unknown armor name "$name"';
  }

  static function applyJitter(baseBonus:Int, id:EquipmentId):Int {
    var f = jitter01(id);
    var v = Std.int(Math.round(baseBonus * (1.0 + f)));
    if (v < 1)
      v = 1;
    return v;
  }

  static function defaultPrice(r:Rarity, bonusValue:Int):Int {
    var tier = switch r {
      case Common: 100;
      case Fine: 300;
      case Epic: 800;
      case Legendary: 2000;
    };
    return tier + bonusValue * 10;
  }

  static function jitter01(s:String):Float {
    var h = fnv1a32(s);
    var x = h & 0xFFFFFF;
    var u = x / 16777215.0;
    return (u * 0.2) - 0.1;
  }

  static function fnv1a32(s:String):Int {
    var h:Int = 0x811C9DC5;
    for (i in 0...s.length) {
      h ^= s.charCodeAt(i);
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24));
    }
    return h;
  }
}

private typedef ArmorTemplate = {
  name:String,
  rarity:Rarity,
  baseBonus:Int,
  loyaltyBonus:Int,
};

