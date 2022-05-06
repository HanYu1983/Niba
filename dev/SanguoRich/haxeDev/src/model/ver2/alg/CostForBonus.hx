package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

private function getCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	final peopleBelongPlayer = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);

	return switch costType {
		case 0:
			var totalLake = 0.0;

			// 總共差全滿多少
			var notFull = peopleBelongPlayer.filter((p) -> p.energy < 100);
			for (p in notFull) {
				totalLake += 100 - p.energy;
			}

			// 基本回復20%
			var recover = 0.2;
			// 使用getPeopleCommand, getPeoplePolitical等取得升級後的數值
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));

			// 回復縂差距的10%
			totalLake *= recover;

			// 縂花食物量
			var food = totalLake * 1;

			if (player.food < food) {
				recover *= player.food / food;
				food = player.food;
			}
			food *= .8 + (.2 * (1 - (getPeoplePolitical(ctx, people.id) / 100)));

			return {
				playerCost: {
					food: food,
					money: 0.0
				},
				peopleGain: {
					energy: recover,
					exp: 0.0,
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
			var recover = 0.02;
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));

			// 回復縂差距的10%
			totalLake *= recover;

			// 縂花食物量
			var food = totalLake * .3;

			if (player.food < food) {
				recover *= player.food / food;
				food = player.food;
			}
			food *= .8 + (.2 * (1 - (getPeoplePolitical(ctx, people.id) / 100)));

			{
				playerCost: {
					food: food,
					money: 0.0
				},
				peopleGain: {
					energy: 0.0,
					exp: recover
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
			var recover = 0.2;
			// 使用getPeopleCommand, getPeoplePolitical等取得升級後的數值
			recover *= 1.0 + (.2 * (getPeopleCommand(ctx, people.id) / 100));

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
					money: money
				},
				peopleGain: {
					energy: recover,
					exp: 0.0,
				},
				successRate: 0.5
			};
		case _:
			throw new haxe.Exception('unknown costType: ${costType}');
	}
}

private function onCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	switch getCostForBonusCost(ctx, playerId, peopleId, costType) {
		case {playerCost: {food: costFood, money: costMoney}, peopleGain: {energy: gainEnergy, exp: gainExp}, successRate: successRate}:
			final p1 = getPeopleById(ctx, peopleId);
			final player = ctx.players[playerId];
			final eventValue = {
				costType: costType,
				people: getPeopleInfo(ctx, p1),
				peopleBefore: getPlayerInfo(ctx, player).people,
				peopleAfter: getPlayerInfo(ctx, player).people,
			}
			{
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
						final grid = ctx.grids[player.position];
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
			ctx.events.push(COST_FOR_BONUS_RESULT(eventValue));
	}
}

function _getResultOfCost(ctx:Context, p1Player:PlayerInfo, p1People:model.PeopleGenerator.People, costType:Int):{
	costFood:Float,
	costMoney:Float,
	gainExp:Float,
	gainEnergy:Float
} {
	return switch getCostForBonusCost(ctx, p1Player.id, p1People.id, costType) {
		case {playerCost: {food: costFood, money: costMoney}, peopleGain: {energy: gainEnergy, exp: gainExp}, successRate: successRate}:
			return {
				costFood: costFood,
				costMoney: costMoney,
				gainEnergy: gainEnergy,
				gainExp: gainExp,
			}
	}
}

function _takeCostForBonus(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	ctx.events = [];
	onCostForBonusCost(ctx, playerId, peopleId, costType);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}
