package debug_ver1;

import game.Balance;

class StrategyFailQuarterEffectTest {
  public static function testStrategyFailQuarterEffect():Void {
    // 火計：25% 基礎效果（比率型）在 Balance 只管 base rate；此處檢查整數/浮點 helper 行為即可
    if (Balance.strategyFailBaseRate("jice_fire") != 0.25)
      throw "StrategyFailQuarterEffectTest: expected fire fail rate=0.25";
    if (Balance.strategyFailBaseRate("jice_farm") != 0.0)
      throw "StrategyFailQuarterEffectTest: expected farm fail rate=0";

    if (Balance.strategyFailEffectAmountInt(100, "jice_rumor") != 25)
      throw "StrategyFailQuarterEffectTest: expected 25% of 100 = 25";
    if (Balance.strategyFailEffectAmountInt(5, "jice_rumor") != 1)
      throw "StrategyFailQuarterEffectTest: expected 25% of 5 = 1";
    var f = Balance.strategyFailEffectAmountFloat(0.20, "jice_raid");
    if (Math.abs(f - 0.05) > 0.0001)
      throw "StrategyFailQuarterEffectTest: expected 0.05";
  }
}

