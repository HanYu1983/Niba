package impl_ver1.equipment;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;
import impl_ver1.model.Equipment;

/**
 * docs/裝備系統.md：武器清單（武力/勇武 Might 加成）與忠誠提升。
 * 目前先以「名稱→固定基準值」提供；同名裝備可用 id 產生 ±10% 浮動。
 */
class WeaponCatalog {
  static final templates:Array<WeaponTemplate> = [
    // 普通
    {name: "武士刀", rarity: Common, baseBonus: 5, loyaltyBonus: 5},
    {name: "長槍", rarity: Common, baseBonus: 8, loyaltyBonus: 5},
    // 精良
    {name: "村正", rarity: Fine, baseBonus: 15, loyaltyBonus: 10},
    // 史詩
    {name: "青龍偃月刀", rarity: Epic, baseBonus: 25, loyaltyBonus: 15},
    {name: "丈八蛇矛", rarity: Epic, baseBonus: 28, loyaltyBonus: 15},
    // 傳說
    {name: "方天畫戟", rarity: Legendary, baseBonus: 40, loyaltyBonus: 20},
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
    return new Equipment(id, t.name, Weapon, t.rarity, Might, v, t.loyaltyBonus, p);
  }

  static function findTemplate(name:String):WeaponTemplate {
    for (t in templates)
      if (t.name == name)
        return t;
    throw 'WeaponCatalog: unknown weapon name "$name"';
  }

  /** 同名武器加成浮動（±10%），由 id 決定，確保可重現。 */
  static function applyJitter(baseBonus:Int, id:EquipmentId):Int {
    var f = jitter01(id); // [-0.1, 0.1]
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
    // 以加成幅度做線性放大（避免同稀有度價格都一樣）
    return tier + bonusValue * 10;
  }

  /**
   * 將字串 hash 成 0..1，再映射到 [-0.1, 0.1]。
   * 不依賴平台的 Random，避免測試/重播不一致。
   */
  static function jitter01(s:String):Float {
    var h = fnv1a32(s);
    // 取低 24 bit 做比例（避免 Int 溢位帶來的平台差異）
    var x = h & 0xFFFFFF;
    var u = x / 16777215.0; // 0..1
    return (u * 0.2) - 0.1;
  }

  static function fnv1a32(s:String):Int {
    var h:Int = 0x811C9DC5;
    for (i in 0...s.length) {
      h ^= s.charCodeAt(i);
      // h *= 16777619（用位移避免某些 target 的乘法差異）
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24));
    }
    return h;
  }
}

private typedef WeaponTemplate = {
  name:String,
  rarity:Rarity,
  baseBonus:Int,
  loyaltyBonus:Int,
};

