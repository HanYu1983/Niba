package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

private function getCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	final player = getPlayerById(ctx, playerId);
	final people = getPeopleById(ctx, peopleId);
	final peopleAbilities = getPeopleAbilities(ctx, people.id);
	final peopleBelongPlayer = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);
	final useEnergy = people.energy / (100 / ENERGY_COST_ON_COST_FOR_FUN);
	final base = getBase(useEnergy, ENERGY_COST_ON_COST_FOR_FUN, 0.0) * 1.0;
	return switch costType {
		case 0:
			var totalLake = 0.0;

			// 總共差全滿多少
			var notFull = peopleBelongPlayer.filter((p) -> p.energy < 100);
			for (p in notFull) {
				totalLake += 100 - p.energy;
			}

			// 基本回復20%
			var recover = base * 0.3;
			// 使用getPeopleCommand, getPeoplePolitical等取得升級後的數值
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));
			recover *= peopleAbilities.has(6) ? 1.5 : 1.0;
			// 回復縂差距的10%
			totalLake *= recover;

			// 縂花食物量
			var food = totalLake * 1;

			if (player.food < food) {
				recover *= player.food / food;
				food = player.food;
			}
			food *= .8 + (.2 * (1 - (getPeopleIntelligence(ctx, people.id) / 100)));

			return {
				playerCost: {
					food: food,
					money: 0.0,
					army: 0.0,
				},
				peopleGain: {
					energy: recover,
					exp: 0.0,
				},
				peopleCost: {
					energy: base
				},
				successRate: 0.5
			};
		case 1:
			var totalLake = 0.0;

			// 總共差全滿多少
			var notFull = peopleBelongPlayer.filter((p) -> p.exp < 810);
			for (p in notFull) {
				totalLake += 810 - p.exp;
			}

			// 基本回復2%
			var recover = base * 0.03;
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));
			recover *= peopleAbilities.has(6) ? 1.5 : 1.0;
			// 回復縂差距的10%
			totalLake *= recover;

			// 縂花食物量
			var food = totalLake * 0.3;

			if (player.food < food) {
				recover *= player.food / food;
				food = player.food;
			}
			food *= .8 + (.2 * (1 - (getPeopleIntelligence(ctx, people.id) / 100)));

			{
				playerCost: {
					food: 0.0,
					money: 0.0,
					army: food
				},
				peopleGain: {
					energy: 0.0,
					exp: recover
				},
				peopleCost: {
					energy: base
				},
				successRate: 0.5
			}
		case 2:
			var totalLake = 0.0;

			// 總共差全滿多少
			var notFull = peopleBelongPlayer.filter((p) -> p.energy < 100);
			for (p in notFull) {
				totalLake += 100 - p.energy;
			}

			// 基本回復20%
			var recover = base * 0.3;
			// 使用getPeopleCommand, getPeoplePolitical等取得升級後的數值
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));
			recover *= peopleAbilities.has(6) ? 1.5 : 1.0;

			// 回復縂差距的10%
			totalLake *= recover;

			// 縂花
			var money = totalLake * 1;

			if (player.money < money) {
				recover *= player.money / money;
				money = player.money;
			}
			money *= .8 + (.2 * (1 - (getPeoplePolitical(ctx, people.id) / 100)));

			return {
				playerCost: {
					food: 0.0,
					money: money,
					army: 0.0,
				},
				peopleGain: {
					energy: recover,
					exp: 0.0,
				},
				peopleCost: {
					energy: base
				},
				successRate: 0.5
			};
		case _:
			throw new haxe.Exception('unknown costType: ${costType}');
	}
}

private function onCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	switch getCostForBonusCost(ctx, playerId, peopleId, costType) {
		case {
			playerCost: {food: costFood, money: costMoney, army: costArmy},
			peopleCost: {energy: costEnergy},
			peopleGain: {energy: gainEnergy, exp: gainExp},
			successRate: successRate
		}:
			final p1 = getPeopleById(ctx, peopleId);
			final player = getPlayerById(ctx, playerId);
			final grid = ctx.grids[player.position];
			final eventValue = {
				costType: costType,
				people: getPeopleInfo(ctx, p1),
				peopleBefore: getPlayerInfo(ctx, player).people,
				peopleAfter: getPlayerInfo(ctx, player).people,
				gridId: grid.id,
			}
			{
				p1.energy = Math.max(0, p1.energy - costEnergy);
				player.army = Math.max(0, player.army - costArmy);
				player.food = Math.max(0, player.food - costFood);
				player.money = Math.max(0, player.money - costMoney);
				final peopleBelongPlayer = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);
				switch costType {
					case 0:
						// 回體
						for (people in peopleBelongPlayer) {
							people.energy = Math.min(100, people.energy + (100 - people.energy) * gainEnergy);
						}
					case 1:
						// 練兵
						// 加功績
						for (people in peopleBelongPlayer) {
							onPeopleExpAdd(ctx, people.id, (810 - people.exp) * gainExp);
						}
					case 2:
						// 作樂會將錢付給格子
						grid.money += costMoney;
						// 回體
						for (people in peopleBelongPlayer) {
							people.energy = Math.min(100, people.energy + (100 - people.energy) * gainEnergy);
						}
				}
				// TODO
				onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, successRate), model.Config.ENERGY_COST_ON_EXPLORE));
			}
			eventValue.peopleAfter = getPlayerInfo(ctx, player).people;
			ctx.events.push(COST_FOR_BONUS_RESULT(eventValue, getGameInfo(ctx, false)));
	}
}

function _getResultOfCost(ctx:Context, p1Player:PlayerInfo, p1People:model.PeopleGenerator.People, costType:Int):{
	costFood:Float,
	costMoney:Float,
	costArmy:Float,
	gainExp:Float,
	gainEnergy:Float
} {
	return switch getCostForBonusCost(ctx, p1Player.id, p1People.id, costType) {
		case {playerCost: {food: costFood, money: costMoney, army: costArmy}, peopleGain: {energy: gainEnergy, exp: gainExp}, successRate: successRate}:
			return {
				costFood: costFood,
				costMoney: costMoney,
				costArmy: costArmy,
				gainEnergy: gainEnergy,
				gainExp: gainExp,
			}
	}
}

function _takeCostForBonus(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	onCostForBonusCost(ctx, playerId, peopleId, costType);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
	sortEventWhenRealPlayer(ctx);
}
