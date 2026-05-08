package debug_ver1;

import game.Balance;

class StrategyEffectMultiplierTest {
  public static function testStrategyEffectMultiplier():Void {
    // stamina 85 → modifier 1.0
    assertClose(Balance.strategyEffectMultiplier(70, 85), 0.7, 0.0001);
    // stamina 60 → modifier 0.8
    assertClose(Balance.strategyEffectMultiplier(70, 60), 0.56, 0.0001);
    // clamp stat
    assertClose(Balance.strategyEffectMultiplier(200, 85), 1.0, 0.0001);
    assertClose(Balance.strategyEffectMultiplier(-10, 85), 0.0, 0.0001);

    // amount helpers
    if (Balance.strategyEffectAmountInt(100, 70, 85) != 70)
      throw "StrategyEffectMultiplierTest: expected amountInt=70";
    // stamina 60 → 0.56, floor(100*0.56)=56
    if (Balance.strategyEffectAmountInt(100, 70, 60) != 56)
      throw "StrategyEffectMultiplierTest: expected amountInt=56";
    assertClose(Balance.strategyEffectAmountFloat(0.20, 70, 85), 0.14, 0.0001);
  }

  static function assertClose(got:Float, expected:Float, eps:Float):Void {
    if (Math.abs(got - expected) > eps)
      throw "StrategyEffectMultiplierTest: got=" + got + " expected=" + expected;
  }
}

