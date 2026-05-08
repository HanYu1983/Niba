package debug_ver1;

import impl_ver1.equipment.WeaponCatalog;
import impl_ver1.equipment.ArmorCatalog;
import impl_ver1.equipment.TacticsBookCatalog;
import impl_ver1.equipment.PoliticsBookCatalog;

/**
 * 對齊 docs/數值算法.md §8.1：
 * - Common: +5~10
 * - Fine: +10~20
 * - Epic: +20~35
 * - Legendary: +35~50
 *
 * 並順便驗證 §8.2 忠誠度加成（由模板決定）至少不為 0。
 */
class EquipmentBonusRangeTest {
  public static function testEquipmentBonusRange():Void {
    // 用各 catalog 的已知名稱覆蓋四種稀有度
    assertRange(WeaponCatalog.spawnByName("eq-w-c", "武士刀"), 5, 10);
    assertRange(WeaponCatalog.spawnByName("eq-w-f", "村正"), 10, 20);
    assertRange(WeaponCatalog.spawnByName("eq-w-e", "青龍偃月刀"), 20, 35);
    assertRange(WeaponCatalog.spawnByName("eq-w-l", "方天畫戟"), 35, 50);

    assertRange(ArmorCatalog.spawnByName("eq-a-c", "皮甲"), 5, 10);
    assertRange(ArmorCatalog.spawnByName("eq-a-f", "當世具足"), 10, 20);
    assertRange(ArmorCatalog.spawnByName("eq-a-e", "明光鎧"), 20, 35);
    assertRange(ArmorCatalog.spawnByName("eq-a-l", "龍鱗鎧"), 35, 50);

    assertRange(TacticsBookCatalog.spawnByName("eq-t-c", "兵書殘卷"), 5, 10);
    assertRange(TacticsBookCatalog.spawnByName("eq-t-f", "孫子兵法"), 10, 20);
    assertRange(TacticsBookCatalog.spawnByName("eq-t-e", "六韜"), 20, 35);
    assertRange(TacticsBookCatalog.spawnByName("eq-t-l", "太公兵法"), 35, 50);

    assertRange(PoliticsBookCatalog.spawnByName("eq-p-c", "論語節選"), 5, 10);
    assertRange(PoliticsBookCatalog.spawnByName("eq-p-f", "貞觀政要"), 10, 20);
    assertRange(PoliticsBookCatalog.spawnByName("eq-p-e", "管子"), 20, 35);
    assertRange(PoliticsBookCatalog.spawnByName("eq-p-l", "韓非子"), 35, 50);

    trace("[EquipmentBonusRangeTest] OK — equipment bonus ranges clamped by rarity");
  }

  static function assertRange(eq:game.IEquipment, lo:Int, hi:Int):Void {
    var v = eq.bonusValue();
    if (v < lo || v > hi)
      throw "EquipmentBonusRangeTest: expected bonus in [" + lo + "," + hi + "], got " + v + " for " + eq.name() + " (" + Std.string(eq.rarity()) + ")";
    if (eq.loyaltyBonus() <= 0)
      throw "EquipmentBonusRangeTest: expected loyaltyBonus > 0, got " + eq.loyaltyBonus();
  }
}

