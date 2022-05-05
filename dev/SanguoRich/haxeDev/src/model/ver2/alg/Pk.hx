package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;

using Lambda;

private function getPkCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final grid = ctx.grids[gridId];
	final p1 = getPeopleById(ctx, p1PeopleId);
	final p2 = getPeopleById(ctx, p2PeopleId);
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_PK);
	final base = getBase(useEnergy, ENERGY_COST_ON_PK, 0.0) * BASE_RATE_PK;
	final fact1 = getPeopleForce(ctx, p1.id) / getPeopleForce(ctx, p2.id);
	final fact2 = Math.pow(getPeopleIntelligence(ctx, p1.id) / getPeopleIntelligence(ctx, p2.id), 0.5);
	final fact3 = 1 + p1.abilities.filter(a -> [0, 1, 2, 3].has(a)).length * 0.15;
	final successRate = base * fact1 * fact2 * fact3;
	final factCharm = Math.min(getPeopleCharm(ctx, p1.id) / getPeopleCharm(ctx, p2.id), 2.0);
	var gainArmy = Math.min(grid.army, PK_ARMY_BASE_CHANGE * Math.pow(successRate, .7) * factCharm);

	final player = ctx.players[playerId];
	gainArmy = Math.min(gainArmy, player.army);

	return {
		peopleCost: [
			{
				id: p1.id,
				energy: useEnergy,
			},
			{
				id: p2.id,
				// 用同樣的體力, 不另外計算
				energy: useEnergy,
			}
		],
		gainArmy: gainArmy,
		successRate: successRate
	}
}

function onTakePk(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
	final p1 = getPeopleById(ctx, p1PeopleId);
	final p2 = getPeopleById(ctx, p2PeopleId);
	final eventValue = {
		success: true,
		people: getPeopleInfo(ctx, p1),
		armyBefore: player.army,
		armyAfter: 0.0,
	};
	switch getPkCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
		case {peopleCost: [p1Cost, p2Cost], gainArmy: gainArmy, successRate: successRate}:
			p1.energy = Math.max(0, p1.energy - p1Cost.energy);
			p2.energy = Math.max(0, p2.energy - p2Cost.energy);
			player.army += gainArmy;
			grid.army = Math.max(0, grid.army - gainArmy);
			// 功績
			onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, successRate), ENERGY_COST_ON_PK));
		case _:
			throw new haxe.Exception("getPkCost not found");
	}
	eventValue.armyAfter = player.army;
	ctx.events.push(PK_RESULT(eventValue));
}

function _getPreResultOfPk(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):{
	energyBefore:Int,
	energyAfter:Int,
	armyChange:Int,
	successRate:Float
} {
	final p1 = getPeopleById(ctx, p1PeopleId);
	final cost = getPkCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId);
	return {
		energyAfter: Std.int(Math.max(0, p1.energy - cost.peopleCost[0].energy)),
		energyBefore: Std.int(p1.energy),
		armyChange: Std.int(cost.gainArmy),
		successRate: cost.successRate
	}
}

function _takePk(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	onTakePk(ctx, playerId, gridId, p1PeopleId, p2PeopleId);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}
