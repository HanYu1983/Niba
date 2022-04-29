package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.ver2.Config;
import model.ver2.Define;
import model.ver2.alg.Nego;
import model.ver2.alg.War;

using Lambda;

function _getTakeSnatchPreview(ctx:Context, playerId:Int, gridId:Int):SnatchPreview {
	final warPreview = _getTakeWarPreview(ctx, playerId, gridId);
	return {
		p1ValidPeople: warPreview.p1ValidPeople,
		p2ValidPeople: warPreview.p2ValidPeople,
		isP1ArmyValid: ctx.players[playerId].army >= SNATCH_ARMY_AT_LEAST,
		isP2ArmyValid: ctx.grids[gridId].army >= SNATCH_ARMY_AT_LEAST,
	};
}

function _getPreResultOfSnatch(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):PreResultOnSnatch {
	final army1 = Math.min(ctx.players[playerId].army, SNATCH_ARMY_AT_LEAST);
	final army2 = Math.min(ctx.grids[gridId].army, SNATCH_ARMY_AT_LEAST);
	final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	final preResultOnSnatch = {
		war: _getPreResultOfWar(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false}),
		money: cost.money,
		food: cost.food,
	}
	// js.Browser.console.log(preResultOnSnatch);
	return preResultOnSnatch;
}

function getSnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false});
	final negoCost = getNegoCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId);
	final grid = ctx.grids[gridId];
	return {
		warCost: warCost,
		money: warCost.success ? Math.min(negoCost.playerCost.money * 3, grid.money) : 0.0,
		food: warCost.success ? Math.min(negoCost.playerCost.food * 3, grid.food) : 0.0,
		success: warCost.success
	}
}

function applySnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float):Bool {
	applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false});
	final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	if (cost.success == false) {
		return false;
	}
	final grid = ctx.grids[gridId];
	grid.money -= cost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food -= cost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	final player = ctx.players[playerId];
	player.money += cost.money;
	player.food += cost.food;
	return true;
}

function _takeSnatchOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
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
	};
	final army1 = Math.min(ctx.players[playerId].army, SNATCH_ARMY_AT_LEAST);
	final army2 = Math.min(ctx.grids[gridId].army, SNATCH_ARMY_AT_LEAST);
	final success = applySnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.SNATCH_RESULT(resultValue)];
}
