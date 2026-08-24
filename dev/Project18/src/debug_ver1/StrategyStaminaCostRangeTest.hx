package debug_ver1;

import game.Balance;
import game.StrategyCostTier;

class StrategyStaminaCostRangeTest {
  public static function testStrategyStaminaCostRange():Void {
    assertTier(Low, 10, 15);
    assertTier(Medium, 20, 30);
    assertTier(High, 40, 50);
  }

  static function assertTier(tier:StrategyCostTier, lo:Int, hi:Int):Void {
    var r = Balance.strategyStaminaCostRange(tier);
    if (r.lo != lo || r.hi != hi)
      throw "StrategyStaminaCostRangeTest: range mismatch for " + Std.string(tier);

    var c0 = Balance.rollStrategyStaminaCost(tier, 0.0);
    if (c0 != lo)
      throw "StrategyStaminaCostRangeTest: u=0 should pick lo for " + Std.string(tier);

    // u 接近 1 時應落在 hi（用 0.999999 避免踩到 1.0 邊界）
    var c1 = Balance.rollStrategyStaminaCost(tier, 0.999999);
    if (c1 != hi)
      throw "StrategyStaminaCostRangeTest: u~1 should pick hi for " + Std.string(tier);
  }
}

