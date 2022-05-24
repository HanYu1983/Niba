package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;

using Lambda;

private function onBuildingCost(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, current:BUILDING, to:BUILDING) {
	final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, current));
	if (catelog.length == 0) {
		throw new haxe.Exception('current.catelog找不到:${current}');
	}
	final costMoney = catelog[0].money;
	final success = true;
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	if (success) {
		final useEnergy = people.energy / (100 / ENERGY_COST_ON_BUILDING);
		people.energy -= useEnergy;
		player.money = Math.max(0, player.money - costMoney);
		var checked = false;
		ctx.attachments = ctx.attachments.map(a -> {
			if (a.belongToGridId != gridId) {
				return a;
			}
			if (a.type.equals(current)) {
				a.type = to;
				checked = true;
			}
			return a;
		});
		if (checked == false) {
			throw new Exception("current傳錯了, 沒有這個building");
		}
		// 功績
		onPeopleExpAdd(ctx, peopleId, getExpAdd(0.3, ENERGY_COST_ON_BUILDING));
	}
	ctx.events.push(BUILDING_RESULT({
		success: success,
		people: getPeopleInfo(ctx, people),
		building: to,
		gridId: gridId,
	}, getGameInfo(ctx, false)));
}

function _takeBuilding(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, current:BUILDING, to:BUILDING) {
	onBuildingCost(ctx, playerId, gridId, peopleId, current, to);
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasBuild = true;
	}
	sortEventWhenRealPlayer(ctx);
}
