package debug_ver1;

import game.Balance;
import game.Rarity;

class ShopRarityProgressionTest {
  public static function testShopRarityProgression():Void {
    // 用同一組 u 取樣，對比早期 vs 後期出現高稀有度的數量應增加。
    var us:Array<Float> = [0.05, 0.15, 0.25, 0.40, 0.55, 0.70, 0.82, 0.90, 0.95, 0.99];
    var early = countHigh(0, 40, us);
    var late = countHigh(25, 40, us);
    if (late < early)
      throw "ShopRarityProgressionTest: expected late>=early high-rarity count, got early=" + early + " late=" + late;

    // 高聲望在同一進度下也應不劣於低聲望
    var lowP = countHigh(12, 10, us);
    var highP = countHigh(12, 80, us);
    if (highP < lowP)
      throw "ShopRarityProgressionTest: expected high prestige>=low prestige, got low=" + lowP + " high=" + highP;
  }

  static function countHigh(round:Int, prestige:Int, us:Array<Float>):Int {
    var n = 0;
    for (u in us) {
      var r = Balance.rollShopRarity(round, prestige, u);
      if (r == Epic || r == Legendary)
        n++;
    }
    return n;
  }
}

