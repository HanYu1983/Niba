package debug_ver1;

import game.Balance;

class PlayerTargetStrategyEffectTest {
  public static function testPlayerTargetStrategyEffect():Void {
    // stamina 85 → modifier 1.0
    if (Balance.dissensionLoyaltyLoss(70, 85) != 7)
      throw "PlayerTargetStrategyEffectTest: dissension expected 7";

    // 急襲：base = ceil(1000*0.1)+floor(70/10)=100+7=107 → *0.7 = 74.9 floor=74
    if (Balance.raidTroopLoss(1000, 70, 85) != 74)
      throw "PlayerTargetStrategyEffectTest: raid expected 74";

    // 徵兵：base = min(ceil(1000*0.05)+floor(70/10),20)=min(50+7,20)=20 → *0.7 = 14
    if (Balance.conscriptionTroopTake(1000, 70, 85) != 14)
      throw "PlayerTargetStrategyEffectTest: conscription expected 14";

    // stamina 60 → modifier 0.8, multiplier=0.56
    // dissension: floor(10*0.56)=5
    if (Balance.dissensionLoyaltyLoss(70, 60) != 5)
      throw "PlayerTargetStrategyEffectTest: dissension expected 5 at stamina 60";
  }
}

