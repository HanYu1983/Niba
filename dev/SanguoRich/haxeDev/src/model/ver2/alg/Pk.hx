package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.tool.Fact;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.AlgPlayer;
import model.ver2.alg.AlgGrid;
import model.ver2.alg.AlgPeople;

using Lambda;

private function getPkCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final grid = ctx.grids[gridId];
	final player = getPlayerById(ctx, playerId);
	final p1 = getPeopleById(ctx, p1PeopleId);
	final p1Abilities = getPeopleAbilities(ctx, p1.id);
	final p2 = getPeopleById(ctx, p2PeopleId);
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_PK);
	final successRate = {
		final base = getBase(useEnergy, ENERGY_COST_ON_PK, 0.0) * BASE_RATE_PK;
		final fact1 = getFact(getPeopleForce(ctx, p1.id) / getPeopleForce(ctx, p2.id));
		final fact2 = getFact(getPeopleIntelligence(ctx, p1.id) / getPeopleIntelligence(ctx, p2.id));
		final fact3 = getFact(1 + p1Abilities.filter(a -> [0, 1, 2, 3].has(a)).length * 0.15);
		base * getFact(fact1 * fact2 * fact3);
	}
	final gainArmy = {
		final fact1 = getFact(getPeopleCharm(ctx, p1.id) / getPeopleCharm(ctx, p2.id));
		final fact2 = factVery(getFact(successRate), 0.7);
		Math.min(player.army, Math.min(grid.army, PK_ARMY_BASE_CHANGE * getFact(fact1 * fact2)));
	}
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

private function onTakePk(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final player = getPlayerById(ctx, playerId);
	final grid = ctx.grids[gridId];
	final p1 = getPeopleById(ctx, p1PeopleId);
	final p2 = getPeopleById(ctx, p2PeopleId);
	final eventValue = {
		success: true,
		people: getPeopleInfo(ctx, p1),
		armyBefore: player.army,
		armyAfter: 0.0,
		gridId: gridId,
		favorBefore: grid.favor[playerId],
		favorAfter: grid.favor[playerId],
	};
	eventValue.success = switch getPkCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
		case {peopleCost: [p1Cost, p2Cost], gainArmy: gainArmy, successRate: successRate}:
			switch 0 {
				case 0:
					final success = Math.random() < successRate;
					if (success) {
						p1.energy = Math.max(0, p1.energy - p1Cost.energy);
						p2.energy = Math.max(0, p2.energy - p2Cost.energy);
						player.army += gainArmy;
						grid.army = Math.max(0, grid.army - gainArmy);
						// 功績
						onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, successRate), ENERGY_COST_ON_PK));
						// 提升友好度
						final isLikeYou = Math.random() < PK_LIKE_RATE;
						if (isLikeYou) {
							for (targetPlayerId in 0...grid.favor.length) {
								if (targetPlayerId == playerId) {
									// 對你提升友好
									grid.favor[targetPlayerId] = Std.int(Math.min(MAX_GRID_FAVOR, grid.favor[targetPlayerId] + 1));
								} else {
									// 對其它人降低友好
									grid.favor[targetPlayerId] = Std.int(Math.max(MIN_GRID_FAVOR, grid.favor[targetPlayerId] - 1));
								}
							}
						}
					}
					success;
				case 1:
					p1.energy = Math.max(0, p1.energy - p1Cost.energy);
					p2.energy = Math.max(0, p2.energy - p2Cost.energy);
					player.army += gainArmy;
					grid.army = Math.max(0, grid.army - gainArmy);
					// 功績
					onPeopleExpAdd(ctx, p1.id, getExpAdd(Math.min(1, successRate), ENERGY_COST_ON_PK));
					// 提升友好度
					final isLikeYou = Math.random() < successRate;
					if (isLikeYou) {
						for (targetPlayerId in 0...grid.favor.length) {
							if (targetPlayerId == playerId) {
								// 對你提升友好
								grid.favor[targetPlayerId] = Std.int(Math.min(MAX_GRID_FAVOR, grid.favor[targetPlayerId] + 1));
							} else {
								// 對其它人降低友好
								grid.favor[targetPlayerId] = Std.int(Math.max(MIN_GRID_FAVOR, grid.favor[targetPlayerId] - 1));
							}
						}
					}
					if (p2.belongToPlayerId != null) {
						final targetPlayer = getPlayerById(ctx, p2.belongToPlayerId);
						targetPlayer.hate.push(playerId);
					}
					true;
				case _:
					false;
			}
		case _:
			throw new haxe.Exception("getPkCost not found");
	}
	eventValue.armyAfter = player.army;
	eventValue.favorAfter = grid.favor[playerId];
	ctx.events.push(PK_RESULT(eventValue, getGameInfo(ctx, false)));
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
	sortEventWhenRealPlayer(ctx);
}
