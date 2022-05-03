package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

function getCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	return switch costType {
		case 0:
			{
				playerCost: {
					food: 100.0,
				},
				peopleGain: {
					energy: 10.0,
					exp: 0.0,
				},
				successRate: 0.5
			}
		case 1:
			{
				playerCost: {
					food: 100.0,
				},
				peopleGain: {
					energy: 0.0,
					exp: 10.0
				},
				successRate: 0.5
			}
		case _:
			throw new haxe.Exception('unknown costType: ${costType}');
	}
}

function onCostForBonusCost(ctx:Context, playerId:Int, peopleId:Int, costType:Int) {
	switch getCostForBonusCost(ctx, playerId, peopleId, costType) {
		case {playerCost: {food: costFood}, peopleGain: {energy: gainEnergy, exp: gainExp}, successRate: successRate}:
			final player = ctx.players[playerId];
			player.food = Math.max(0, player.food - costFood);
			final peopleBelongPlayer = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);
			for (people in peopleBelongPlayer) {
				people.energy = Math.min(100, people.energy + gainEnergy);
				// 功績
				onPeopleExpAdd(ctx, people.id, gainExp);
			}
			final people = getPeopleById(ctx, peopleId);
			// TODO
			onPeopleExpAdd(ctx, people.id, getExpAdd(Math.min(1, successRate), model.Config.ENERGY_COST_ON_EXPLORE));
			ctx.events.push(COST_FOR_BONUS_RESULT({
				costType: costType,
				people: getPeopleInfo(ctx, people)
			}));
	}
}

function _getResultOfCost(ctx:Context, p1Player:PlayerInfo, p1People:model.PeopleGenerator.People,
		costType:Int):{costFood:Float, gainExp:Float, gainEnergy:Float} {
	return switch getCostForBonusCost(ctx, p1Player.id, p1People.id, costType) {
		case {playerCost: {food: costFood}, peopleGain: {energy: gainEnergy, exp: gainExp}, successRate: successRate}:
			return {
				costFood: costFood,
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
