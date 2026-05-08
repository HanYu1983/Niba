package impl_ver1.equipment;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;
import impl_ver1.equipment.CatalogCommon;
import impl_ver1.equipment.CatalogCommon.EquipmentTemplate;

/** docs/裝備系統.md：兵法書清單（智力/Wit 加成）與忠誠提升。 */
class TacticsBookCatalog {
  static final templates:Array<EquipmentTemplate> = [
    // 普通
    {name: "兵書殘卷", rarity: Common, baseBonus: 5, loyaltyBonus: 5},
    {name: "戰策", rarity: Common, baseBonus: 8, loyaltyBonus: 5},
    // 精良
    {name: "孫子兵法", rarity: Fine, baseBonus: 15, loyaltyBonus: 10},
    // 史詩
    {name: "六韜", rarity: Epic, baseBonus: 25, loyaltyBonus: 15},
    {name: "三略", rarity: Epic, baseBonus: 28, loyaltyBonus: 15},
    // 傳說
    {name: "太公兵法", rarity: Legendary, baseBonus: 40, loyaltyBonus: 20},
  ];

  public static function allNames():Array<String> {
    return CatalogCommon.allNames(templates);
  }

  public static function namesByRarity(r:Rarity):Array<String> {
    return CatalogCommon.namesByRarity(templates, r);
  }

  public static function spawnByName(id:EquipmentId, name:String, ?price:Int):IEquipment {
    return CatalogCommon.spawnByName("TacticsBookCatalog", templates, id, name, TacticsBook, Wit, price);
  }
}
