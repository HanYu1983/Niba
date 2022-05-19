package model;

// 幾個回合加成(4人走完算1回合)
// 作用中
final PLAYER_EARN_PER_TURN = 1;
final SHOW_POPUP_WHEN_EARN = false;

// 可以交易友好度
final CAN_CHANGE_FAVOR = -3;

// 主公支付的薪水為主公所有武將的價值參數(cost)總合的%數
final PLAYER_SPEND_MONEY_FOR_PEOPLE_PER_TURN_PERSENT = 0.005;

// 主公支付的食物為所有格子上以及身上的士兵的數量的%數
final PLAYER_SPEND_FOOD_FOR_ARMY_PER_TURN_PERSENT = 0.05;

// 武將聘用價格%數
final PEOPLE_HIRE_COST_FACTOR = .1;

// 格子的成長週期
// 格子依據自己的成長值成長
// 格子的成長植受到該格子上的所有武將的智力(主要影響食物)、政治(主要影響金錢)、統率(主要影響士兵)影響
// 作用中
final GRID_EARN_PER_TURN = 1;

// 格子的基本保底成長
final BASIC_GROW_MONEY_RATE = 0.02;
final BASIC_GROW_FOOD_RATE = 0.02;
final BASIC_GROW_ARMY_RATE = 0.02;

// 幾個回合收稅(4人走完算1回合)
// 作用中
final PLAYER_EARN_FROM_CITY_PER_TURN = 5;

//
final FAVER_SLOW_PER_TURN = 20;

// 收稅:主公身上的資源增加，依據所有城池的金錢、食物、士兵、策略點(?)個別合計之後的%數
// 實作成會從城中扣掉加到主公身上
// 作用中
final PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT = .025;

// 基本一單交易量的最低限, 前端在傳入moneyBase時不能小於這個值
// 這個值共用於所有買賣
// 作用中
final MONEY_PER_DEAL = 100;

// 戰鬥能力影響倍率
final WAR_FRONT_ABILITY_FACTOR = 1.4;

// 戰鬥支援能力，影響及金錢糧草
final WAR_BACK_ABILITY_FACTOR = .7;

// 戰鬥支付金錢整體調整
final WAR_MONEY_COST_FACTOR = .1;

// 戰鬥支付食物整體調整
final WAR_FOOD_COST_FACTOR = 0.3;

// 戰鬥防守方士兵加成
final WAR_DEFFENDER_FACTOR = 2.0;

// 兵數量差優勢, 越高代表影響越小
final WAR_HIGH_LOW_FACTOR = 1.2;

// 保底傷害, 1的話代表派100兵最少打100
final WAR_ARMY_FACTOR = 0.0;

// 戰爭最後係數
final WAR_FINAL_DAMAGE_FACTOR = 0.75;

// 每回合基本回體力
final PEOPLE_ENERGY_SUPPLY_BASE = 1;

// 每回合額外回復％數體力(體力越多回越快)
final PEOPLE_ENERGY_SUPPLY_SAVE_FACTOR = 0.05;

// 允許交涉加兵
final ENABLE_NEGO_ARMY = false;

// 派越少的兵力體力扣越少
function getEnergyFactor(atkArmy:Float) {
	return (Math.min(atkArmy / 500, 1) * .3 + .7);
}

final ENERGY_COST_ON_STRATEGY = 30;
final ENERGY_COST_ON_HIRE = 10;
final ENERGY_COST_ON_NEGO = 20;
final ENERGY_COST_ON_RESOURCE = 10;
final ENERGY_COST_ON_EXPLORE = 10;
final ENERGY_COST_ON_BUILDING = 10;
final ENERGY_COST_ON_SNATCH = 15;
final ENERGY_COST_ON_WAR = 30;
final ENERGY_COST_ON_PK = 15;
final ENERGY_COST_ON_COST_FOR_FUN = 15;

// 最低搶奪所需兵力
final SNATCH_ARMY_AT_LEAST = 30;

// 單挑的士兵變化基本量
final PK_ARMY_BASE_CHANGE = 30;

// 最低友好度
final MIN_GRID_FAVOR = -3;

// 最高友好度
final MAX_GRID_FAVOR = 3;

// 交涉失敗時討厭你的機率
final NEGO_HATE_RATE = 0.15;

// 交涉成功時喜歡你的機率
final NEGO_LIKE_RATE = 0.85;

//
final PK_LIKE_RATE = 0.5;

// 交易時喜歡你的機率
final RESOURCE_LIKE_RATE = 0.3;

// 搶奪時額外討厭你的機率
final SNATCH_HATE_RATE = 0.3;

// 基本值算法
function getBase(useEnergy:Float, totalEnergy:Float = 30.0, offset:Float = 0.0, bottom:Float = 0.0):Float {
	return Math.max((useEnergy / totalEnergy) + offset, bottom);
}

// 升級
final EXP_LEVEL_GATES:Array<Int> = [50, 110, 180, 260, 350, 450, 560, 680, 810];
final EXP_LEVEL_COST_EXT:Array<Float> = [0.0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18];
final EXP_LEVEL_ABI_EXT:Array<Int> = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
final EXP_UP = {s: 5, e: 20};

// 功績等級0~9
// 0為普通人
// 1~9為武將或文官
function getExpLevel(exp:Float):Int {
	for (i in 0...EXP_LEVEL_GATES.length) {
		if (exp < EXP_LEVEL_GATES[i]) {
			return i;
		}
	}
	return EXP_LEVEL_GATES.length;
}

function getExpAdd(p:Float, max:Float):Float {
	return (max - EXP_UP.s) * p + EXP_UP.s;
}

// 體力產生的基本值成數
// 1代表支付所有體力時, 機率為1
final BASE_RATE_STRATEGY = 0.8;
final BASE_RATE_RESOURCE = 1.2;
final BASE_RATE_PK = 0.7;
final BASE_RATE_NEGO = 1.0;
final BASE_RATE_HIRE = .8;
final BASE_RATE_EXPLORE = 1.2;

// 格子資源上限
final GRID_RESOURCE_MAX = 1000.0;

// 每回合每個城加糧事件機率(暫時通用在錢和兵)
final EVENT_GROW_FOOD_RATE = 0.005;

// 每回合每個城加糧事件的糧食數量(暫時通用在錢和兵)
final EVENT_GROW_FOOD_AMOUNT = 100;

// 每回合異軍突起的機率
final EVENT_GRID_BORN_RATE = 1 / 15.0;

// 異軍突起的資源數量
final EVENT_GRID_BORN_RESOURCE_AMOUNT = 350.0;

// 探索時寶物出現機率
final FIND_TREASURE_WHEN_SUCCESS_BASE_RATE = 0.2;

// 搶劫時寶物出現機率基礎
final FIND_TREASURE_WHEN_SNATCH_SUCCESS_BASE_RATE = 0.5;

// 攻城時寶物出現機率基礎(未使用)
final FIND_TREASURE_WHEN_WAR_SUCCESS_BASE_RATE = 0.0;

// 沒收寶物扣的體力成數
final ENERGY_RATE_FOR_TREASURE_TAKE = 0.3;

// 過路費
final GRID_TAX = 0.15;

// 初始資源
final INIT_RESOURCE = 1200.0;

// 格子數
final INIT_GRID_COUNT = 30;
