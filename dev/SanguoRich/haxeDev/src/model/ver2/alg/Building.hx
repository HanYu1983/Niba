package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;

using Lambda;

private function applyBuildingCost(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic):Bool {
	final costMoney = 20;
	final currBuilding = (current : BUILDING);
	final toBuilding = (to : BUILDING);
	final success = true;
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	if (success) {
		player.money = Math.max(0, player.money - costMoney);
		// 功績
		onPeopleExpAdd(ctx, peopleId, getExpAdd(0.3, ENERGY_COST_ON_BUILDING));
		var checked = false;
		ctx.attachments = ctx.attachments.map(a -> {
			if (a.belongToGridId != gridId) {
				return a;
			}
			if (a.type.equals(currBuilding)) {
				a.type = toBuilding;
				checked = true;
			}
			return a;
		});
		if (checked == false) {
			throw new Exception("current傳錯了, 沒有這個building");
		}
	}
	return success;
}

function _takeBuilding(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic) {
	ctx.events = [];
	final success = applyBuildingCost(ctx, playerId, gridId, peopleId, current, to);
	if (success) {
		final people = getPeopleById(ctx, peopleId);
		final toBuilding = (to : BUILDING);
		ctx.events.push(Event.BUILDING_RESULT({
			success: success,
			people: getPeopleInfo(ctx, people),
			building: toBuilding,
		}));
	}
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}
