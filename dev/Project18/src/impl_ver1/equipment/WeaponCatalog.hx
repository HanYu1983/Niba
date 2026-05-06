package impl_ver1.equipment;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;
import impl_ver1.equipment.CatalogCommon;
import impl_ver1.equipment.CatalogCommon.EquipmentTemplate;

/**
 * docs/裝備系統.md：武器清單（武力/勇武 Might 加成）與忠誠提升。
 * 目前先以「名稱→固定基準值」提供；同名裝備可用 id 產生 ±10% 浮動。
 */
class WeaponCatalog {
  static final templates:Array<EquipmentTemplate> = [
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
    return CatalogCommon.allNames(templates);
  }

  public static function spawnByName(id:EquipmentId, name:String, ?price:Int):IEquipment {
    return CatalogCommon.spawnByName("WeaponCatalog", templates, id, name, Weapon, Might, price);
  }
}
