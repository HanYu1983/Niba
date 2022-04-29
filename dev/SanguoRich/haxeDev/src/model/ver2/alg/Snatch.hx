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

function _getPreResultOfSnatch(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool):PreResultOnSnatch {
	if (isOccupation) {
		final army1 = switch guessArmy(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
			case {army: army}:
				army;
		}
		final army2 = ctx.grids[gridId].army;
		final preResultOnSnatch = {
			war: _getPreResultOfWar(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: true}),
			money: 0.0,
			food: 0.0,
		}
		// js.Browser.console.log(preResultOnSnatch);
		return preResultOnSnatch;
	} else {
		final army1 = Math.min(ctx.players[playerId].army, SNATCH_ARMY_AT_LEAST);
		final army2 = Math.min(ctx.grids[gridId].army, SNATCH_ARMY_AT_LEAST);
		final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, false);
		final preResultOnSnatch = {
			war: _getPreResultOfWar(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false}),
			money: cost.money,
			food: cost.food,
		}
		// js.Browser.console.log(preResultOnSnatch);
		return preResultOnSnatch;
	}
}

function getSnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, isOccupation:Bool) {
	final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: isOccupation});

	// 本來搶奪的資源跟交涉能力挂鈎，實際玩起來覺得很怪。改爲越是大勝利，搶的越多
	// final negoCost = getNegoCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId);
	var base = 0.3 + (warCost.playerCost[1].army / warCost.playerCost[0].army) * .06;
	base = Math.min(base, .6);
	final grid = ctx.grids[gridId];
	return {
		warCost: warCost,
		money: warCost.success ? grid.money * base : 0.0,
		food: warCost.success ? grid.food * base : 0.0,
		success: warCost.success
	}
}

function guessArmy(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final army2 = ctx.grids[gridId].army;
	final totalArmy = ctx.players[playerId].army;
	var s = 0.0;
	var e = totalArmy;
	var army1 = 0.0;
	var successArmy = 0.0;
	for (i in 0...10) {
		army1 = (s + e) / 2;
		final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: true});
		switch warCost.playerCost[1].army {
			case costArmy if (costArmy >= army2):
				e = army1;
				successArmy = army1;
			case _:
				s = army1;
		}
	}
	final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, successArmy, army2, {occupy: true});
	final success = warCost.playerCost[1].army >= army2;
	return {
		success: success,
		army: success ? successArmy : totalArmy
	}
}

function applySnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, isOccupation:Bool):Bool {
	if (isOccupation) {
		final warArmy1 = switch guessArmy(ctx, playerId, gridId, p1PeopleId, p2PeopleId) {
			case {army: army}:
				army;
		}
		final warArmy2 = ctx.grids[gridId].army;
		return applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, warArmy1, warArmy2, {occupy: true});
	} else {
		// 處理搶奪中的戰爭部分
		applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false});
		// 處理搶奪中的搶資源部分
		final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, isOccupation);
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
}

function _takeSnatchOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool) {
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
	final success = applySnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, isOccupation);
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = if (isOccupation) {
		[Event.WAR_RESULT(resultValue)];
	} else {
		[Event.SNATCH_RESULT(resultValue)];
	}
}
