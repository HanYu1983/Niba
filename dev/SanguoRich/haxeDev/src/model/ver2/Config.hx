package model.ver2;

// 幾個回合加成(4人走完算1回合)
// 作用中
final PLAYER_EARN_PER_TURN = 2;

// 主公支付的薪水為主公所有武將的價值參數(value)總合的%數
// 主公支付的食物為所有格子上以及身上的士兵的數量的%數
// 作用中
final PLAYER_EARN_PER_TURN_PERSENT = 0.03;

// 武將聘用價格%數
final PEOPLE_HIRE_COST_FACTOR = .1;

// 格子的成長週期
// 格子依據自己的成長值成長
// 格子的成長植受到該格子上的所有武將的智力(主要影響食物)、政治(主要影響金錢)、統率(主要影響士兵)影響
// 作用中
final GRID_EARN_PER_TURN = 1;

// 格子的基本保底成長
final BASIC_GROW_MONEY = 1;
final BASIC_GROW_FOOD = 1;
final BASIC_GROW_ARMY = 1;

// 幾個回合收稅(4人走完算1回合)
// 作用中
final PLAYER_EARN_FROM_CITY_PER_TURN = 10;

// 收稅:主公身上的資源增加，依據所有城池的金錢、食物、士兵、策略點(?)個別合計之後的%數
// 實作成會從城中扣掉加到主公身上
// 作用中
final PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT = .1;

// 基本一單買糧買兵的的金錢
// 作用中
final MONEY_PER_DEAL = 100;

// 基本一單賣糧的數目
// 作用中
final FOOD_PER_DEAL = 100;

// 基本一單賣兵的數目
// 作用中
final ARMY_PER_DEAL = 100;

// 戰鬥能力影響倍率
final WAR_FRONT_ABILITY_FACTOR = 1.4;

// 戰鬥支援能力，影響及金錢糧草
final WAR_BACK_ABILITY_FACTOR = .7;

// 戰鬥支付金錢整體調整
final WAR_MONEY_COST_FACTOR = .05;

// 戰鬥支付食物整體調整
final WAR_FOOD_COST_FACTOR = 1.4;

// 戰鬥防守方士兵加成
final WAR_DEFFENDER_FACTOR = 4.0;

// 兵數量差優勢, 越高代表影響越小
final WAR_HIGH_LOW_FACTOR = 1.5;

// 保底傷害, 1的話代表派100兵最少打100
final WAR_ARMY_FACTOR = 0.3;

// 戰爭最後係數
final WAR_FINAL_DAMAGE_FACTOR = 0.75;

// 每回合基本回體力
final PEOPLE_ENERGY_SUPPLY_BASE = 0;

// 每回合額外回復％數體力(體力越多回越快)
final PEOPLE_ENERGY_SUPPLY_SAVE_FACTOR = 0.05;

// 允許交涉加兵
final ENABLE_NEGO_ARMY = true;

// 派越少的兵力體力扣越少
function getEnergyFactor(atkArmy:Float) {
	return (Math.min(atkArmy / 500, 1) * .3 + .7);
}

final ENERGY_COST_ON_HIRE = 10;
final ENERGY_COST_ON_NEGO = 20;
final ENERGY_COST_ON_RESOURCE = 20;
final ENERGY_COST_ON_EXPLORE = 30;
final ENERGY_COST_ON_SNATCH = 30;
final ENERGY_COST_ON_WAR = 70;
final SNATCH_ARMY_AT_LEAST = 100;

// 最低友好度
final MIN_GRID_FAVOR = -3;

// 最高友好度
final MAX_GRID_FAVOR = 3;

// 交涉失敗時討厭你的機率
final NEGO_HATE_RATE = 0.15;

// 交涉成功時喜歡你的機率
final NEGO_LIKE_RATE = 0.7;

// 搶奪時額外討厭你的機率
final SNATCH_HATE_RATE = 0.3;

// 基本值算法
function getBase(useEnergy:Float, totalEnergy:Float = 30.0, offset:Float = 0.0, bottom:Float = 0.0):Float {
	return Math.max((useEnergy / totalEnergy) + offset, bottom);
}
