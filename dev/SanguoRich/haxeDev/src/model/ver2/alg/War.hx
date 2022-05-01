package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

// =================================
// 佔領
// 派兵目前的設計是【糧食】消耗為主要，【金錢】次之或者不用消耗
// 攻擊方主要參數為【武力】及【智力】  	防守方主要參數為【統率】及【智力】
// 攻擊方影響能力[0,1,2,3]         	 防守方影響能力[0,1,2,3,8,9];
// =================================
function getWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, options:{occupy:Bool}) {
	var atkMoneyCost = 0.0;
	var atkFoodCost = 0.0;
	{
		final atkArmy = army1;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = getPeopleIntelligence(ctx, atkPeople.id) / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		atkMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		atkFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	var atkDamage = 0.0;
	var atkEnergyCost = 0.0;
	{
		final atkArmy = army1;
		final defArmy = army2;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final defPeople = getPeopleById(ctx, p2PeopleId);
		final currMoney = ctx.players[playerId].money;
		final currFood = ctx.players[playerId].food;
		final moneyCost = atkMoneyCost;
		final foodCost = atkFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = useEnergy / ENERGY_COST_ON_WAR;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = getPeopleForce(ctx, atkPeople.id) / getPeopleCommand(ctx, defPeople.id);
		final fact7 = getPeopleIntelligence(ctx, atkPeople.id) / getPeopleIntelligence(ctx, defPeople.id);
		final factWall = 1.0 - ctx.attachments.filter(a -> a.belongToGridId == gridId).fold((p, a) -> {
			return a + switch p.type {
				case WALL(level):
					return [0.0, 0.15, 0.35, 0.5][level];
				case _:
					0.0;
			}
		}, 0.0);
		final factMoney = if (currMoney - moneyCost < 0) (1.0 - (-1 * (currMoney - moneyCost) / moneyCost)) else 1.0;
		final factFood = if (currFood - foodCost < 0) (1.0 - (-1 * (currFood - foodCost) / foodCost)) else 1.0;
		final base = atkArmy;
		final damage = atkArmy * WAR_ARMY_FACTOR + base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * factMoney * factFood * factWall;
		atkDamage = damage * WAR_FINAL_DAMAGE_FACTOR;
		atkEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	var defMoneyCost = 0.0;
	var defFoodCost = 0.0;
	{
		final atkArmy = army2;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = getPeopleIntelligence(ctx, atkPeople.id) / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		defMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		defFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	var defDamage = 0.0;
	var defEnergyCost = 0.0;
	{
		final atkArmy = army2;
		final defArmy = army1;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final defPeople = getPeopleById(ctx, p1PeopleId);
		final currMoney = ctx.grids[gridId].money;
		final currFood = ctx.grids[gridId].food;
		final moneyCost = defMoneyCost;
		final foodCost = defFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = useEnergy / ENERGY_COST_ON_WAR;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = if (options.occupy && atkPeople.abilities.has(8)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact7 = if (options.occupy && atkPeople.abilities.has(9)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact8 = getPeopleCommand(ctx, atkPeople.id) / getPeopleForce(ctx, defPeople.id);
		final fact9 = getPeopleIntelligence(ctx, atkPeople.id) / getPeopleIntelligence(ctx, defPeople.id);
		final factWall = 1.0 + ctx.attachments.filter(a -> a.belongToGridId == gridId).fold((p, a) -> {
			return a + switch p.type {
				case WALL(level):
					return [0.0, 0.15, 0.35, 0.5][level];
				case _:
					0.0;
			}
		}, 0.0);
		final factMoney = if (currMoney - moneyCost < 0) (1.0 - (-1 * (currMoney - moneyCost) / moneyCost)) else 1.0;
		final factFood = if (currFood - foodCost < 0) (1.0 - (-1 * (currFood - foodCost) / foodCost)) else 1.0;
		final base = if (options.occupy) atkArmy * WAR_DEFFENDER_FACTOR else atkArmy;
		final damage = atkArmy * WAR_ARMY_FACTOR
			+ base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * fact8 * fact9 * factMoney * factFood * factWall;
		defDamage = damage * WAR_FINAL_DAMAGE_FACTOR;
		defEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	return {
		playerCost: [
			{
				id: (playerId : Null<Int>),
				army: Math.min(defDamage, army1),
				money: atkMoneyCost,
				food: atkFoodCost,
			},
			{
				id: getGridBelongPlayerId(ctx, gridId),
				army: Math.min(atkDamage, army2),
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
		success: options.occupy ? ((ctx.grids[gridId].army - atkDamage) <= 0) : (atkDamage > defDamage)
	}
}

function _getTakeWarPreview(ctx:Context, playerId:Int, gridId:Int):WarPreview {
	final grid = ctx.grids[gridId];
	if (grid.buildtype == GROWTYPE.EMPTY) {
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
					maintainArmy: 0.0,
					maintainPeople: 0.0,
					armyGrow: 0.0,
					grids: [],
					commands: []
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
				p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people
			};
	}
}

function _getPreResultOfWar(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float,
		options:{occupy:Bool}):Array<PreResultOnWar> {
	return switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, options) {
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

function _takeWarOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
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
	final success = applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: true});
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.WAR_RESULT(resultValue)];
}

function applyWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, options:{occupy:Bool}):Bool {
	switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, options) {
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
			if (options.occupy) {
				if (success) {
					// 沒有進駐的話, 自動進駐
					if (people.position.gridId == null) {
						people.position.gridId = gridId;
					}
					// 回到主公身上或解散
					people2.position.gridId = null;

					// 體力減半
					people2.energy *= 0.5;
				}
			} else {
				//
			}
			// 友好度
			if (options.occupy) {
				grid.favor[playerId] = MIN_GRID_FAVOR;
			} else {
				// 先減1
				grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
				// 額外再減
				final isHateYou = Math.random() < SNATCH_HATE_RATE;
				if (isHateYou) {
					grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
				}
			}
			if (success) {
				// 功績
				people.exp += getExpAdd(1);
			}
			return success;
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}
