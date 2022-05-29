package model.ver2.alg;

import haxe.Exception;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.tool.Mock;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.AlgPlayer;
import model.ver2.alg.AlgGrid;
import model.ver2.alg.AlgPeople;

using Lambda;

private function onBuildingCost(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, current:BUILDING, to:BUILDING) {
	final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, current));
	if (catelog.length == 0) {
		throw new haxe.Exception('current.catelog找不到:${current}');
	}
	final player = getPlayerById(ctx, playerId);
	final people = getPeopleById(ctx, peopleId);
	final peopleAbilities = getPeopleAbilities(ctx, peopleId);
	// 有修補可以減少成本
	final costRate = peopleAbilities.has(9) ? 0.5 : 1.0;
	final costMoney = catelog[0].money * costRate;
	final success = true;
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

function test() {
	final ctx:Context = getDefaultContext();
	ctx.grids.push({
		final grid = getDefaultGrid();
		grid;
	});
	ctx.players.push({
		final player = getDefaultPlayer();
		player;
	});
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.energy = 100;
			people;
		}
	];
	final firstAttachment = {
		final attach = getDefaultAttachment();
		attach.belongToGridId = 0;
		attach.type = MARKET(0);
		attach;
	};
	ctx.attachments = [firstAttachment];
	try {
		onBuildingCost(ctx, 0, 0, 0, FARM(0), FARM(1));
	} catch (e) {
		if (e.message != "current傳錯了, 沒有這個building") {
			throw new haxe.Exception("必須回傳[current傳錯了, 沒有這個building]");
		}
	}
	onBuildingCost(ctx, 0, 0, 0, MARKET(0), FARM(1));
	switch firstAttachment.type {
		case FARM(1):
		case _:
			throw new haxe.Exception("必須變成FARM(1)");
	}
	assertRandomMockFinish();
}
