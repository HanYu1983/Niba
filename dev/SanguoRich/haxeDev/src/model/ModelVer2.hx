package model;

import model.IModel.PreResultOnFire;
import model.IModel.PreResultOnResource;
import model.IModel.ResourcePreview;
import model.IModel.MARKET;
import model.IModel.RESOURCE;
import model.IModel.GameInfo;
import model.GridGenerator.BUILDING;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnWar;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;

using Lambda;

// 幾個回合加成(4人走完算1回合)
// 作用中
final PLAYER_EARN_PER_TURN = 3;

// 主公支付的薪水為主公所有武將的value(?)總合的%數
// 所有格子(?)以及主公支付的食物為所有士兵的數量的%數
// 作用中
final PLAYER_EARN_PER_TURN_PERSENT = 0.02;

// 格子的成長週期
// 格子依據自己的成長值成長
// 格子的成長植受到該格子上的所有武將的智力(主要影響食物)、政治(主要影響金錢)、統率(主要影響士兵)影響
// 作用中
final GRID_EARN_PER_TURN = 1;

// 幾個回合收稅(4人走完算1回合)
// 作用中
final PLAYER_EARN_FROM_CITY_PER_TURN = 10;

// 收稅:主公身上的資源增加，依據所有城池的金錢、食物、士兵、策略點(?)個別合計之後的%數
// 實作成會從城中扣掉加到主公身上
// 作用中
final PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT = .05;

// 所有支出能量的加權(方便整體調整體力支出)
// 作用中
final TOTAL_ENERGY_COST_FACTOR = 0.3;

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
final WAR_FRONT_ABILITY_FACTOR = 1.3;

// 戰鬥支援能力，影響及金錢糧草
final WAR_BACK_ABILITY_FACTOR = .8;

// 戰鬥支付金錢整體調整
final WAR_MONEY_COST_FACTOR = .05;

// 戰鬥支付食物整體調整
final WAR_FOOD_COST_FACTOR = 1.3;

// 戰鬥防守方士兵加成
final WAR_DEFFENDER_FACTOR = 2.5;

// 兵數量差優勢, 越高代表影響越小
final WAR_HIGH_LOW_FACTOR = 1.5;

// 保底傷害, 1的話代表派100兵最少打100
final WAR_ARMY_FACTOR = 0.5;

// 派越少的兵力體力扣越少
function getEnergyFactor(atkArmy:Float) {
	return (Math.min(atkArmy / 500, 0) * .8 + .2);
}

// 稅收
// 主公會得到所有城池的成數
// =========================================
// config
// 以下的方法都不定義回傳的類型, 因為是動態設計, 做到哪想到哪
// 每一個回傳都是依靠編譯器的類型推理
// 所以可以把回傳最多欄位的放在case的第1個, 讓編譯器告訴你其它的回傳少了哪些欄位
// =========================================
// 交涉計算
// 參與能力為:7良官
private function getNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	// 使用switch達成策略模式
	// 0代表預設的隨意實作
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(id -> getPeopleById(ctx, id));
			return switch fightPeople {
				case [p1, p2]:
					// 用掉1/5的體力(最多20)
					// 體力越少效率越低
					final useEnergy = p1.energy / 5;
					// 使用20體力的情況下基礎值為0.5
					final base = (useEnergy / 100) + 0.3;
					final intelligenceFactor = p1.intelligence / p2.intelligence;
					final politicalFactor = p1.political / p2.political;
					final charmFactor = p1.charm / p2.charm;
					// 良官加成
					final abiFactor = p1.abilities.has(7) ? 1.5 : 1;
					final rate = base * intelligenceFactor * politicalFactor * charmFactor * abiFactor;
					final gainRate = 0.1 * rate + 0.1;
					{
						playerCost: {
							id: playerId,
							army: 0.0, // 交涉可能先不能拿兵。因爲兵士防守用的
							money: grid.money * gainRate,
							food: grid.food * gainRate
						},
						peopleCost: {
							id: p1.id,
							energy: useEnergy,
						},
						successRate: rate
					};
				case _:
					throw new haxe.Exception("fightPeople not right");
			}
		case 1:
			// 版本1
			{
				playerCost: {
					id: 0,
					army: 0.0,
					money: 0.0,
					food: 0.0,
				},
				peopleCost: {
					id: 0,
					energy: 0.0,
				},
				successRate: 0.0,
			}
		case _:
			throw new haxe.Exception("not impl");
	}
}

// 雇用計算
private function getHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(p -> getPeopleById(ctx, p));
			return switch fightPeople {
				case [p1, p2]:
					final useEnergy = p1.energy * TOTAL_ENERGY_COST_FACTOR;
					final base = (useEnergy / 100) + 0.2;
					final charmFactor = p1.charm / p2.charm;
					// 人脈加成
					final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
					final rate = base * charmFactor * abiFactor;
					{
						playerCost: {
							id: playerId,
							money: p2.cost
						},
						peopleCost: {
							id: p1.id,
							energy: useEnergy,
						},
						successRate: rate
					};
				case _:
					throw new haxe.Exception("fightPeople not right");
			}
		case _:
			throw new haxe.Exception("not impl");
	}
}

// 探索計算
private function getExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy * TOTAL_ENERGY_COST_FACTOR;
			final base = (useEnergy / 100) + 0.2;
			final charmFactor = p1.charm / 100;
			// 人脈加成
			final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
			final rate = base * charmFactor * abiFactor;
			return {
				playerCost: {
					id: playerId,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				},
				successRate: rate
			};
		case _:
			throw new haxe.Exception("not impl");
	}
}

// 經商買賣計算
// money:    ability 4
// food:     ability 5
// army:     ability 11
// strategy: ability 3
// 智力、政治、魅力也會影響最終數值
private function getResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	trace("MondelVer2", "getResourceCost", market, type);
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy * TOTAL_ENERGY_COST_FACTOR;
			final base = (useEnergy / 100) + 0.2;
			final abiFactor:Float = if (type == RESOURCE.MONEY && (p1.abilities.has(4))) {
				1.5;
			} else if (type == RESOURCE.ARMY && (p1.abilities.has(11))) {
				1.5;
			} else if (type == RESOURCE.FOOD && (p1.abilities.has(5))) {
				1.5;
			} else {
				1;
			};
			final attrFactor:Float = if (type == RESOURCE.MONEY) {
				(p1.political/100) * .8 + (p1.intelligence/100) * .1 + (p1.charm/100) * .1 + (grid.money / 1000) * .1;
			} else if (type == RESOURCE.ARMY) {
				(p1.political/100) * .1 + (p1.intelligence/100) * .1 + (p1.charm/100) * .8 + (grid.army / 1000) * .1;
			} else if (type == RESOURCE.FOOD) {
				(p1.political/100) * .1 + (p1.intelligence/100) * .8 + (p1.charm/100) * .1 + (grid.food / 1000) * .1;
			} else {
				0;
			};
			final rate = (base + attrFactor) * abiFactor;
			final returnInfo = {
				playerCost: {
					id: playerId,
					money: 0.0,
					army: 0.0,
					food: 0.0,
					strategy: 0.0,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				}
			};
			switch [type, market] {
				case [MONEY, _]:
					returnInfo.playerCost.money = -1 * 100 * rate;
				case [ARMY, SELL]:
					final sellArmyCount = ARMY_PER_DEAL;
					returnInfo.playerCost.money = -1 * sellArmyCount * rate;
					returnInfo.playerCost.army = sellArmyCount;
				case [FOOD, SELL]:
					final sellFoodCount = FOOD_PER_DEAL;
					returnInfo.playerCost.money = -1 * sellFoodCount * rate;
					returnInfo.playerCost.food = sellFoodCount;
				case [STRETEGY, SELL]:
					final sellIntCount = 100;
					returnInfo.playerCost.money = -1 * sellIntCount * rate;
					returnInfo.playerCost.strategy = sellIntCount;
				case [ARMY, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					returnInfo.playerCost.money = moneyCost;
					returnInfo.playerCost.army = -moneyCost * rate;
				case [FOOD, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					returnInfo.playerCost.money = moneyCost;
					returnInfo.playerCost.food = -moneyCost * rate;
				case [STRETEGY, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					returnInfo.playerCost.money = moneyCost;
					returnInfo.playerCost.strategy = -moneyCost * rate;
			}
			return returnInfo;
		case _:
			throw new haxe.Exception("not impl");
	}
}

// =================================
// 佔領
// 派兵目前的設計是【糧食】消耗為主要，【金錢】次之或者不用消耗
// 攻擊方主要參數為【武力】及【智力】  	防守方主要參數為【統率】及【智力】
// 攻擊方影響能力[0,1,2,3]         	 防守方影響能力[0,1,2,3,8,9];
// 2022/4/26 測試到奇怪的現象，就是感覺就是强很多的武將，結果爲了打爆對方。糧食扣的比爛武將多。感覺很奇怪？
// =================================
private function getWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	var atkDamage = 0.0;
	var atkEnergyCost = 0.0;
	{
		final atkArmy = army1;
		final defArmy = army2;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final defPeople = getPeopleById(ctx, p2PeopleId);
		final useEnergy = (atkPeople.energy * TOTAL_ENERGY_COST_FACTOR);
		final fact0 = useEnergy / 100;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = atkPeople.force / defPeople.command;
		final fact7 = atkPeople.intelligence / defPeople.intelligence;
		final base = atkArmy;
		final damage = atkArmy * WAR_ARMY_FACTOR + base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7;
		atkDamage = damage;
		atkEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	var defDamage = 0.0;
	var defEnergyCost = 0.0;
	{
		final atkArmy = army2;
		final defArmy = army1;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final defPeople = getPeopleById(ctx, p1PeopleId);
		final useEnergy = (atkPeople.energy * TOTAL_ENERGY_COST_FACTOR);
		final fact0 = useEnergy / 100;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = if (atkPeople.abilities.has(8)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact7 = if (atkPeople.abilities.has(9)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact8 = atkPeople.command / defPeople.force;
		final fact9 = atkPeople.intelligence / defPeople.intelligence;
		final base = atkArmy * WAR_DEFFENDER_FACTOR;
		final damage = atkArmy * WAR_ARMY_FACTOR + base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * fact8 * fact9;
		defDamage = damage;
		defEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	var atkMoneyCost = 0.0;
	var atkFoodCost = 0.0;
	{
		final atkArmy = army1;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = atkPeople.intelligence / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		atkMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		atkFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	var defMoneyCost = 0.0;
	var defFoodCost = 0.0;
	{
		final atkArmy = army2;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = atkPeople.intelligence / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		defMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		defFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	return {
		playerCost: [
			{
				id: (playerId : Null<Int>),
				army: defDamage,
				money: atkMoneyCost,
				food: atkFoodCost,
			},
			{
				id: getGridBelongPlayerId(ctx, gridId),
				army: atkDamage,
				money: defMoneyCost,
				food: defFoodCost,
			}
		],
		peopleCost: [
			{
				id: p1PeopleId,
				energy: atkEnergyCost,
			},
			{
				id: p2PeopleId,
				energy: defEnergyCost,
			}
		],
		success: (ctx.grids[gridId].army - atkDamage) <= 0
	}
}

// 玩家回合結束
private function doPlayerEnd(ctx:Context) {
	ctx.actions = [];
	ctx.events = [];
	// 四個玩家走完後才計算回合
	final isTurnEnd = ctx.currentPlayerId == (ctx.players.length - 1);
	if (isTurnEnd) {
		// 先假設每回合回體力
		{
			final enable = ctx.turn > 0 && ctx.turn % 1 == 0;
			// 回體力
			for (people in ctx.peoples) {
				people.energy += 5 + people.energy / 10;
				if (people.energy > 100) {
					people.energy = 100;
				}
			}
		}
		// 支付薪水
		{
			final enable = ctx.turn > 0 && ctx.turn % PLAYER_EARN_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "支付薪水");
				final worldEventValue = {
					playerBefore: ctx.players.map(p -> getPlayerInfo(ctx, p)),
					playerAfter: ([] : Array<model.IModel.PlayerInfo>),
					gridBefore: ctx.grids.map(g -> getGridInfo(ctx, g)),
					gridAfter: ([] : Array<model.GridGenerator.Grid>),
				}
				// 玩家
				for (player in ctx.players) {
					// 支付武將的薪水
					{
						player.money -= getMaintainPeople(ctx, player.id);
						if (player.money < 0) {
							player.money = 0;
						}
					}
					// 吃食物
					{
						player.food -= getMaintainArmy(ctx, player.id);
						if (player.food < 0) {
							player.food = 0;
						}
					}
				}
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				ctx.events.push(Event.WORLD_EVENT(worldEventValue));
			}
		}
		// 格子成長
		{
			final enable = ctx.turn > 0 && ctx.turn % GRID_EARN_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "格子成長");
				for (grid in ctx.grids) {
					final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
					// 沒武將的格子不成長
					if (peopleInGrid.length == 0) {
						continue;
					}
					final totalPeopleIntelligence = peopleInGrid.fold((p, a) -> {
						return a + p.intelligence;
					}, 0.0);
					final totalPeoplePolitical = peopleInGrid.fold((p, a) -> {
						return a + p.political;
					}, 0.0);
					final totalPeoplecharm = peopleInGrid.fold((p, a) -> {
						return a + p.charm;
					}, 0.0);
					final factor1 = 1 / (peopleInGrid.length * 100);
					// 城池成長
					grid.money += grid.money * grid.moneyGrow * (totalPeopleIntelligence * factor1);
					grid.food += grid.food * grid.foodGrow * (totalPeopleIntelligence * factor1);
					grid.army += grid.army * grid.armyGrow * (totalPeopleIntelligence * factor1);
				}
			}
		}
		// 收稅
		{
			final enable = ctx.turn > 0 && ctx.turn % PLAYER_EARN_FROM_CITY_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "收稅");
				final worldEventValue = {
					playerBefore: ctx.players.map(p -> getPlayerInfo(ctx, p)),
					playerAfter: ([] : Array<model.IModel.PlayerInfo>),
					gridBefore: ctx.grids.map(g -> getGridInfo(ctx, g)),
					gridAfter: ([] : Array<model.GridGenerator.Grid>),
				}
				for (grid in ctx.grids) {
					// 有主公的才有稅收
					final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
					if (belongPlayerId == null) {
						continue;
					}
					final player = ctx.players[belongPlayerId];
					final earnArmy = grid.army * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					final earnFood = grid.food * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					final earnMoney = grid.money * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					grid.army -= earnArmy;
					if (grid.army < 0) {
						grid.army = 0;
					}
					grid.food -= earnFood;
					if (grid.food < 0) {
						grid.food = 0;
					}
					grid.money -= earnMoney;
					if (grid.money < 0) {
						grid.money = 0;
					}
					player.army += earnArmy;
					player.food += earnFood;
					player.money += earnMoney;
				}
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				ctx.events.push(Event.WORLD_EVENT(worldEventValue));
			}
		}
		// 下一回合
		ctx.turn += 1;
	}
	// 下一個玩家
	ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
}

private function getMaintainPeople(ctx:Context, playerId:Int):Float {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + p.cost;
	}, 0.0);
	return getMaintainPeoplePure(totalPeopleCost);
}

private function getMaintainArmy(ctx:Context, playerId:Int):Float {
	final totalArmy = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) + ctx.players[playerId].army;
	return getMaintainArmyPure(totalArmy);
}

private function getMaintainPeoplePure(totalPeopleCost:Float):Float {
	return totalPeopleCost * PLAYER_EARN_PER_TURN_PERSENT;
}

private function getMaintainArmyPure(totalArmy:Float):Float {
	return totalArmy * PLAYER_EARN_PER_TURN_PERSENT;
}

// =========================================
// binding
// =========================================
class ModelVer2 extends DebugModel {
	final context:Context = {
		grids: [],
		attachments: [],
		peoples: [],
		players: [],
		currentPlayerId: 0,
		actions: [],
		events: [],
		turn: 0
	}

	override function gameStart(cb:Void->Void):Void {
		initContext(context, {});
		cb();
	}

	override function gameInfo():GameInfo {
		final info = getGameInfo(context, true);
		// js.Browser.console.log(info);
		return info;
	}

	override function playerDice(cb:() -> Void) {
		doPlayerDice(context);
		cb();
	}

	override function playerEnd(cb:() -> Void) {
		doPlayerEnd(context);
		cb();
	}

	override function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return doGetTakeNegoPreview(context, playerId, gridId);
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnNego {
		return doGetPreResultOfNego(context, playerId, gridId, people.id, invite.id);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeNegoOn(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}

	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return doGetTakeHirePreview(context, playerId, gridId);
	}

	override function getPreResultOfHire(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnHire {
		return doGetPreResultOfHire(context, playerId, gridId, people.id, invite.id);
	}

	override function takeHire(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeHire(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}

	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return _getTakeExplorePreview(context, playerId, gridId);
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:model.PeopleGenerator.People):PreResultOnExplore {
		return _getPreResultOfExplore(context, playerId, gridId, people.id);
	}

	override function takeExplore(playerId:Int, gridId:Int, p1SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeExplore(context, playerId, gridId, p1SelectId);
		cb(gameInfo());
	}

	override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return _getTakeWarPreview(context, playerId, gridId);
	}

	override function getPreResultOfWar(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, p2:model.PeopleGenerator.People, army1:Float,
			army2:Float):Array<PreResultOnWar> {
		return _getPreResultOfWar(context, playerId, gridId, p1.id, p2.id, army1, army2);
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		_takeWarOn(context, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
		cb(gameInfo());
	}

	override function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
		return _getTakeResourcePreview(context, playerId, gridId, market, type);
	}

	override function getPreResultOfResource(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, market:MARKET, type:RESOURCE):PreResultOnResource {
		return _getPreResultOfResource(context, playerId, gridId, p1.id, market, type);
	}

	override function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		_takeResource(context, playerId, gridId, p1PeopleId, market, type);
		cb(gameInfo());
	}

	override function getPreResultOfFire(playerId:Int, p1PeopleId:Int):PreResultOnFire {
		return _getPreResultOfFire(context, playerId, p1PeopleId);
	}

	override function takeFire(playerId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeFire(context, playerId, p1PeopleId);
		cb(gameInfo());
	}

	override function checkValidTransfer(playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
		js.Browser.console.log(playerInfo, gridInfo);
		return _checkValidTransfer(context, playerId, gridId, playerInfo, gridInfo);
	}

	override function takeTransfer(playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid,
			cb:(gameInfo:GameInfo) -> Void) {
		_takeTransfer(context, playerId, gridId, playerInfo, gridInfo);
		cb(gameInfo());
	}
}

private typedef Grid = {
	id:Int,
	buildtype:BUILDING,
	money:Float,
	food:Float,
	army:Float,
	moneyGrow:Float,
	foodGrow:Float,
	armyGrow:Float
}

private typedef Attachment = {
	id:Int,
	belongToGridId:Int
}

private typedef People = {
	id:Int,
	belongToPlayerId:Null<Int>,
	position:{
		gridId:Null<Int>, player:Bool
	},
	name:String,
	force:Float,
	intelligence:Float,
	political:Float,
	charm:Float,
	cost:Float,
	command:Float,
	abilities:Array<Int>,
	energy:Float
}

private typedef Player = {
	id:Int,
	name:String,
	money:Float,
	food:Float,
	army:Float,
	strategy:Float,
	position:Int,
}

private enum Action {
	MOVE(value:{
		playerId:Int,
		fromGridId:Int,
		toGridId:Int,
	}, gameInfo:GameInfo);
}

private enum Event {
	WORLD_EVENT(value:{
		playerBefore:Array<model.IModel.PlayerInfo>,
		playerAfter:Array<model.IModel.PlayerInfo>,
		gridBefore:Array<model.GridGenerator.Grid>,
		gridAfter:Array<model.GridGenerator.Grid>
	});
	WALK_STOP(value:{
		grid:model.GridGenerator.Grid,
		commands:Array<Dynamic>,
	});
	NEGOTIATE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	EXPLORE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		peopleList:Array<model.PeopleGenerator.People>,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	HIRE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	WAR_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	RESOURCE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		energyBefore:Float,
		energyAfter:Float,
		armyBefore:Float,
		armyAfter:Float,
		moneyBefore:Float,
		moneyAfter:Float,
		foodBefore:Float,
		foodAfter:Float,
	});
	FIRE_RESULT(value:{
		success:Bool,
		people:model.PeopleGenerator.People,
		maintainMoneyAfter:Float,
		maintainMoneyBefore:Float,
	});
}

private typedef Context = {
	grids:Array<Grid>,
	attachments:Array<Attachment>,
	peoples:Array<People>,
	players:Array<Player>,
	currentPlayerId:Int,
	actions:Array<Action>,
	events:Array<Event>,
	turn:Int
}

private function getPeopleInfo(ctx:Context, people:People):model.PeopleGenerator.People {
	return {
		id: people.id,
		type: 0,
		name: people.name,
		command: Std.int(people.command),
		force: Std.int(people.force),
		intelligence: Std.int(people.intelligence),
		political: Std.int(people.political),
		charm: Std.int(people.charm),
		cost: Std.int(people.cost),
		abilities: people.abilities,
		energy: Std.int(people.energy),
		gridId: cast people.position.gridId,
	}
}

private function getPlayerInfo(ctx:Context, player:Player):model.IModel.PlayerInfo {
	return {
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: player.strategy,
		people: ctx.peoples.filter(p -> p.position.player == true && p.belongToPlayerId == player.id).map(p -> getPeopleInfo(ctx, p)),
		atGridId: player.position,
		maintainPeople: getMaintainPeople(ctx, player.id),
		maintainArmy: getMaintainArmy(ctx, player.id),
		grids: ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id).map(g -> getGridInfo(ctx, g))
	}
}

private function getGridBelongPlayerId(ctx:Context, gridId:Int):Null<Int> {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	return peopleInGrid.length > 0 ? peopleInGrid[0].belongToPlayerId : null;
}

private function getGridInfo(ctx:Context, grid:Grid):model.GridGenerator.Grid {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
	return {
		id: grid.id,
		landType: 0,
		buildtype: grid.buildtype,
		height: 0,
		attachs: [],
		belongPlayerId: cast getGridBelongPlayerId(ctx, grid.id),
		value: 0,
		money: grid.money,
		moneyGrow: grid.moneyGrow,
		food: grid.food,
		foodGrow: grid.foodGrow,
		army: grid.army,
		armyGrow: grid.armyGrow,
		people: peopleInGrid.map(p -> getPeopleInfo(ctx, p)),
	}
}

private function getGameInfo(ctx:Context, root:Bool):GameInfo {
	return {
		players: ctx.players.map(p -> getPlayerInfo(ctx, p)),
		grids: ctx.grids.map(p -> getGridInfo(ctx, p)),
		isPlayerTurn: true,
		currentPlayer: getPlayerInfo(ctx, ctx.players[ctx.currentPlayerId]),
		isPlaying: true,
		events: root ? ctx.events.map(e -> {
			// 顯式使用類型(EventInfo), 這裡不能依靠類型推理, 不然會編譯錯誤
			final eventInfo:model.IModel.EventInfo = switch e {
				case WORLD_EVENT(value):
					{
						id: EventInfoID.WORLD_EVENT,
						value: value,
					}
				case WALK_STOP(value):
					{
						id: EventInfoID.WALK_STOP,
						value: value
					}
				case NEGOTIATE_RESULT(value):
					{
						id: EventInfoID.NEGOTIATE_RESULT,
						value: value
					}
				case EXPLORE_RESULT(value):
					{
						id: EventInfoID.EXPLORE_RESULT,
						value: value
					}
				case HIRE_RESULT(value):
					{
						id: EventInfoID.HIRE_RESULT,
						value: value
					}
				case WAR_RESULT(value):
					{
						id: EventInfoID.WAR_RESULT,
						value: value
					}
				case RESOURCE_RESULT(value):
					{
						id: EventInfoID.RESOURCE_RESULT,
						value: value
					}
				case FIRE_RESULT(value):
					{
						id: EventInfoID.FIRE_RESULT,
						value: value
					}
			}
			return eventInfo;
		}) : [],
		actions: root ? ctx.actions.map(a -> {
			final actionInfo:model.IModel.ActionInfo = switch a {
				case MOVE(value, gameInfo):
					{
						id: ActionInfoID.MOVE,
						value: value,
						gameInfo: gameInfo
					}
			}
			return actionInfo;
		}) : []
	}
}

private function addGridInfo(ctx:Context, grid:model.GridGenerator.Grid):Void {
	ctx.grids.push({
		id: grid.id,
		buildtype: grid.buildtype,
		money: grid.money,
		food: grid.food,
		army: grid.army,
		moneyGrow: grid.moneyGrow,
		foodGrow: grid.foodGrow,
		armyGrow: grid.armyGrow,
	});
	for (p in grid.people) {
		ctx.peoples.push({
			id: p.id,
			belongToPlayerId: null,
			position: {
				gridId: grid.id,
				player: false
			},
			name: p.name,
			force: p.force,
			intelligence: p.intelligence,
			political: p.political,
			charm: p.charm,
			cost: p.cost,
			abilities: p.abilities,
			command: p.command,
			energy: p.energy,
		});
	}
}

private function addPeopleInfo(ctx:Context, belongToPlayerId:Null<Int>, gridId:Null<Int>, p:model.PeopleGenerator.People):Void {
	ctx.peoples.push({
		id: p.id,
		belongToPlayerId: belongToPlayerId,
		position: {
			gridId: gridId,
			player: belongToPlayerId != null
		},
		name: p.name,
		force: p.force,
		intelligence: p.intelligence,
		political: p.political,
		charm: p.charm,
		cost: p.cost,
		abilities: p.abilities,
		command: p.command,
		energy: p.energy,
	});
}

private function addPlayerInfo(ctx:Context, player:model.IModel.PlayerInfo):Void {
	ctx.players.push({
		id: player.id,
		name: player.name,
		money: player.money,
		food: player.food,
		army: player.army,
		strategy: player.strategy,
		position: player.atGridId,
	});
	for (p in player.people) {
		ctx.peoples.push({
			id: p.id,
			belongToPlayerId: player.id,
			position: {
				gridId: null,
				player: true
			},
			name: p.name,
			force: p.force,
			intelligence: p.intelligence,
			political: p.political,
			charm: p.charm,
			cost: p.cost,
			abilities: p.abilities,
			command: p.command,
			energy: p.energy,
		});
	}
}

private function initContext(ctx:Context, option:{}) {
	final genGrids = model.GridGenerator.getInst().getGrids(100);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	var i = 0;
	// for (name in ["vic", "han", "xiao", "any"]) {
	for (name in ["vic", "han"]) {
		addPlayerInfo(ctx, {
			id: i++,
			name: name,
			money: 1000.0,
			army: 1000.0,
			food: 1000.0,
			strategy: 1000.0,
			people: [
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate()
			],
			maintainPeople: 0,
			maintainArmy: 0,
			atGridId: 0,
			grids: []
		});
	}
}

private function getPeopleById(ctx:Context, id:Int):People {
	final find = ctx.peoples.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('people not found: ${id}');
	}
	return find[0];
}

private function doPlayerDice(ctx:Context) {
	final activePlayerId = ctx.currentPlayerId;
	final player = ctx.players[activePlayerId];
	final fromGridId = player.position;
	final moveStep = Math.floor(Math.random() * 6) + 1;
	final toGridId = fromGridId + moveStep;
	player.position = toGridId;
	ctx.actions = [
		Action.MOVE({
			playerId: activePlayerId,
			fromGridId: fromGridId,
			toGridId: toGridId
		}, getGameInfo(ctx, false))
	];
	final toGrid = ctx.grids[toGridId];
	ctx.events = [
		Event.WALK_STOP({
			grid: getGridInfo(ctx, toGrid),
			commands: [],
		})
	];
}

// =================================
// 交涉
// 向城池奪取%資源
// =================================
private function doGetTakeNegoPreview(ctx:Context, playerId:Int, gridId:Int):NegoPreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

private function doGetPreResultOfNego(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnNego {
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	final negoCost = getNegoCost(ctx, playerId, gridId, peopleId, inviteId);
	final totalArmy = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) + ctx.players[playerId].army;
	return {
		energyAfter: Std.int(people.energy - negoCost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army + negoCost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money + negoCost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food + negoCost.playerCost.food),
		maintainFoodBefore: getMaintainArmy(ctx, playerId),
		maintainFoodAfter: getMaintainArmyPure(totalArmy + negoCost.playerCost.army),
		successRate: negoCost.successRate
	};
}

private function doTakeNegoOn(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.NEGOTIATE_RESULT(resultValue)];
}

private function applyNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= Std.int(negoCost.peopleCost.energy);
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	// 城池被搶奪
	final grid = ctx.grids[gridId];
	grid.army -= negoCost.playerCost.army;
	if (grid.army < 0) {
		grid.army = 0;
	}
	grid.money -= negoCost.playerCost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food -= negoCost.playerCost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	// 玩家搶奪
	final player = ctx.players[playerId];
	player.army += negoCost.playerCost.army;
	player.money += negoCost.playerCost.money;
	player.food += negoCost.playerCost.food;
	return true;
}

private function doGetTakeHirePreview(ctx:Context, playerId:Int, gridId:Int):HirePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

private function doGetPreResultOfHire(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnHire {
	final player = ctx.players[playerId];
	final cost = getHireCost(ctx, playerId, gridId, peopleId, inviteId);
	final p1 = getPeopleById(ctx, peopleId);
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + p.cost;
	}, 0.0) + p1.cost;
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		moneyBefore: 0,
		moneyAfter: 0,
		successRate: cost.successRate,
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

private function doTakeHire(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.HIRE_RESULT(resultValue)];
}

private function applyHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	final hirePeople = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	// 支付雇用費
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	// 將人變成主公的
	hirePeople.belongToPlayerId = playerId;
	// 將人移到玩家上
	hirePeople.position.player = true;
	// 從格子上移除人
	hirePeople.position.gridId = null;
	return true;
}

// =================================
// 探索
// ================================
private function _getTakeExplorePreview(ctx:Context, playerId:Int, gridId:Int):ExplorePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

private function _getPreResultOfExplore(ctx:Context, playerId:Int, gridId:Int, peopleId:Int):PreResultOnExplore {
	final cost = getExploreCost(ctx, playerId, gridId, peopleId);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		successRate: cost.successRate
	}
}

private function _takeExplore(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		peopleList: ([] : Array<model.PeopleGenerator.People>),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final newPeopleIds = applyExploreCost(ctx, playerId, gridId, p1SelectId);
	resultValue.success = newPeopleIds.length > 0;
	resultValue.peopleList = newPeopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p));
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.EXPLORE_RESULT(resultValue)];
}

private function applyExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int):Array<Int> {
	final negoCost = getExploreCost(ctx, playerId, gridId, p1SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return [];
	}
	final newPeople = PeopleGenerator.getInst().generate();
	addPeopleInfo(ctx, null, gridId, newPeople);
	return [newPeople.id];
}

private function _getTakeWarPreview(ctx:Context, playerId:Int, gridId:Int):WarPreview {
	final grid = ctx.grids[gridId];
	if (grid.buildtype == BUILDING.EMPTY) {
		throw new haxe.Exception("空地不能攻擊");
	}
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	return switch gridBelongPlayerId {
		case null:
			{
				p1: getPlayerInfo(ctx, ctx.players[playerId]),
				p2: {
					id: grid.id,
					name: 'grid${gridId}',
					money: grid.money,
					food: grid.food,
					army: grid.army,
					strategy: 0,
					people: ctx.peoples.filter(p -> p.position.gridId == gridId).map(p -> getPeopleInfo(ctx, p)),
					atGridId: gridId,
					maintainArmy: 0,
					maintainPeople: 0,
					grids: []
				},
				p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
				p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people
			};
		case _:
			final gridPlayer = ctx.players[gridBelongPlayerId];
			{
				p1: getPlayerInfo(ctx, ctx.players[playerId]),
				p2: getPlayerInfo(ctx, gridPlayer),
				p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
				p2ValidPeople: getPlayerInfo(ctx, gridPlayer).people,
			};
	}
}

private function _getPreResultOfWar(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float):Array<PreResultOnWar> {
	return switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2) {
		case {playerCost: [playerCost1, playerCost2], peopleCost: [peopleCost1, peopleCost2]}:
			final player1 = ctx.players[playerId];
			final grid = ctx.grids[gridId];
			final people1 = getPeopleById(ctx, p1PeopleId);
			final people2 = getPeopleById(ctx, p2PeopleId);
			[
				{
					energyBefore: Std.int(people1.energy),
					energyAfter: Std.int(people1.energy - peopleCost1.energy),
					armyBefore: Std.int(player1.army),
					armyAfter: Std.int(player1.army - playerCost1.army),
					moneyBefore: Std.int(player1.money),
					moneyAfter: Std.int(player1.money - playerCost1.money),
					foodBefore: Std.int(player1.food),
					foodAfter: Std.int(player1.food - playerCost1.food),
					maintainFoodBefore: 0,
					maintainFoodAfter: 0,
				},
				{
					energyBefore: Std.int(people2.energy),
					energyAfter: Std.int(people2.energy - peopleCost2.energy),
					armyBefore: Std.int(grid.army),
					armyAfter: Std.int(grid.army - playerCost2.army),
					moneyBefore: Std.int(grid.money),
					moneyAfter: Std.int(grid.money - playerCost2.money),
					foodBefore: Std.int(grid.food),
					foodAfter: Std.int(grid.food - playerCost2.food),
					maintainFoodBefore: 0,
					maintainFoodAfter: 0,
				}
			];
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}

private function _takeWarOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	final people1 = getPeopleById(ctx, p1PeopleId);
	final people2 = getPeopleById(ctx, p2PeopleId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, people1),
		energyBefore: people1.energy,
		energyAfter: people1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.WAR_RESULT(resultValue)];
}

private function applyWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float):Bool {
	switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2) {
		case {playerCost: [playerCost1, playerCost2], peopleCost: [peopleCost1, peopleCost2], success: success}:
			// 無論成功或失敗武將先消體力
			final people = getPeopleById(ctx, p1PeopleId);
			if (people.energy < peopleCost1.energy) {
				throw new haxe.Exception('people.energy ${people.energy} < ${peopleCost1.energy}');
			}
			final people2 = getPeopleById(ctx, p2PeopleId);
			if (people2.energy < peopleCost2.energy) {
				throw new haxe.Exception('people.energy ${people2.energy} < ${peopleCost2.energy}');
			}
			people.energy -= peopleCost1.energy;
			if (people.energy < 0) {
				people.energy = 0;
			}
			people2.energy -= peopleCost2.energy;
			if (people2.energy < 0) {
				people2.energy = 0;
			}
			//
			final player = ctx.players[playerId];
			player.money -= playerCost1.money;
			if (player.money < 0) {
				player.money = 0;
			}
			player.food -= playerCost1.food;
			if (player.food < 0) {
				player.food = 0;
			}
			player.army -= playerCost1.army;
			if (player.army < 0) {
				player.army = 0;
			}

			final grid = ctx.grids[gridId];
			grid.money -= playerCost2.money;
			if (grid.money < 0) {
				grid.money = 0;
			}
			grid.food -= playerCost2.food;
			if (grid.food < 0) {
				grid.food = 0;
			}
			grid.army -= playerCost2.army;
			if (grid.army < 0) {
				grid.army = 0;
			}
			if (success) {
				// 沒有進駐的話, 自動進駐
				if (people.position.gridId != null) {
					people.position.gridId = gridId;
				}
				// 回到主公身上或解散
				people2.position.gridId = null;
				// 體力減半
				people2.energy *= 0.5;
			}
			return success;
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}

// =================================
// 經商：加不定錢
// 買糧：扣固定錢加不定糧食
// 賣糧：扣固定糧加不定錢
// 徵兵：扣固定錢加不定兵
// 裁兵：扣固定兵加不定錢
// 2022/4/26 希望演算法可以把當前格子的資源量納入計算，資源越多，可以得到越多
// 2022/4/26 這個交易的資源也是會影響格子裏的資源量。就是經過交易后變少或變多
// =================================
private function _getTakeResourcePreview(ctx:Context, playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

private function _getPreResultOfResource(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, market:MARKET, type:RESOURCE):PreResultOnResource {
	final player = ctx.players[playerId];
	final cost = getResourceCost(ctx, playerId, gridId, peopleId, market, type);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army - cost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money - cost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food - cost.playerCost.food),
		maintainFoodBefore: 0,
		maintainFoodAfter: 0,
	}
}

private function _takeResource(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	applyResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

private function applyResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final negoCost = getResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final player = ctx.players[playerId];
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	player.food -= negoCost.playerCost.food;
	if (player.food < 0) {
		player.food = 0;
	}
	player.army -= negoCost.playerCost.army;
	if (player.army < 0) {
		player.army = 0;
	}
	player.strategy -= negoCost.playerCost.strategy;
	if (player.strategy < 0) {
		player.strategy = 0;
	}
}

private function _getPreResultOfFire(ctx:Context, playerId:Int, p1PeopleId:Int):PreResultOnFire {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		if (p.id == p1PeopleId) {
			return a;
		}
		return a + p.cost;
	}, 0.0);
	return {
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

private function _takeFire(ctx:Context, playerId:Int, p1PeopleId:Int) {
	final people = getPeopleById(ctx, p1PeopleId);
	final resultValue = {
		success: true,
		people: getPeopleInfo(ctx, people),
		maintainMoneyAfter: 0.0,
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
	people.belongToPlayerId = null;
	people.position.gridId = ctx.players[playerId].position;
	resultValue.maintainMoneyAfter = getMaintainPeople(ctx, playerId);
	ctx.events = [Event.FIRE_RESULT(resultValue)];
}

// 可能不成的情況是
// 把已經有駐守在別的地方的武將派到這裡來
// 或者前端沒有派任何武將到這個格子上
private function _checkValidTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		if (originPeople.position.gridId != null && originPeople.position.gridId != gridId) {
			trace("ModelVer2", "_checkValidTransfer", 'people(${people.id})已經被派駐在grid(${originPeople.position.gridId})');
			return false;
		}
	}
	return true;
}

private function _takeTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	if (peopleInGrid.length == 0) {
		throw new haxe.Exception('找不到守城人在gridId${gridId}');
	};
	final p1 = peopleInGrid[0];
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	applyTransfer(ctx, playerId, gridId, playerInfo, gridInfo);
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

private function applyTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
	player.food = playerInfo.food;
	player.army = playerInfo.army;
	player.money = playerInfo.money;
	grid.food = gridInfo.food;
	grid.army = gridInfo.army;
	grid.money = gridInfo.money;
	// 在同一格的情況, 離開城池
	for (people in playerInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		if (originPeople.position.gridId == gridId) {
			originPeople.position.gridId = null;
		}
	}
	// 進入城池
	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		originPeople.position.gridId = gridId;
	}
}
