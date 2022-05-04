package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
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
	return switch 1 {
		case 0:
			final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: isOccupation});
			final grid = ctx.grids[gridId];
			var maxPercent = grid.favor[playerId] + 3.0;
			// -3~3 => 0~1
			maxPercent /= 7.0;
			// 0~1 => 1~0
			maxPercent = 1.0 - maxPercent;

			// 本來搶奪的資源跟交涉能力挂鈎，實際玩起來覺得很怪。改爲越是大勝利，搶的越多
			var base = 0.4 + (warCost.playerCost[1].army / warCost.playerCost[0].army) * .2;
			base += maxPercent * .2;
			base = Math.min(base, .6 + maxPercent * .2);
			final success = warCost.success;
			return {
				warCost: warCost,
				money: success ? grid.money * base : 0.0,
				food: success ? grid.food * base : 0.0,
				success: success
			}
		case 1:
			final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: isOccupation});
			final grid = ctx.grids[gridId];
			if (grid.army == 0) {
				trace("Snatch", "getSnatchCost", "防守方城池為0兵");
				return {
					warCost: warCost,
					money: grid.money,
					food: grid.food,
					success: true
				}
			}
			// 基本搶劫成數為守方派出的兵佔城裡總兵的成數
			// 比如城裡100兵, 派出20兵的話, 就只能搶0.2
			// 使用對數調整曲線
			var base = army2 / grid.army;
			base *= .7;
			// 保底
			base += .3;
			// 我留下越多兵搶越多, 使用對數調整曲線
			final fact1 = Math.pow(Math.max(0, army1 - warCost.playerCost[0].army) / army1, 0.2);
			final fact2 = {
				// -3~3 => 0~1
				var tmp = grid.favor[playerId] + 3.0;
				tmp /= 6.0;
				// 0~1 => 1~0
				tmp = 1.0 - tmp;
				Math.pow(tmp, 0.3);
			};
			final gainRate = base * fact1 * fact2;
			// 以戰後剩下的資源來計算搶劫
			final moneyAfterWar = Math.max(0, grid.money - warCost.playerCost[1].money);
			final foodAfterWar = Math.max(0, grid.food - warCost.playerCost[1].food);
			final gainMoney = moneyAfterWar * gainRate;
			final gainFood = foodAfterWar * gainRate;
			// 這個計算結果代表攻擊方有留下兵就能搶到資源
			final success = gainRate > 0;
			{
				warCost: warCost,
				money: success ? gainMoney : 0.0,
				food: success ? gainFood : 0.0,
				success: success
			}
		case _:
			throw new haxe.Exception("未知的實作");
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
	ctx.events = [];
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
	ctx.events.push(if (isOccupation) {
		Event.WAR_RESULT(resultValue);
	} else {
		Event.SNATCH_RESULT(resultValue);
	});
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
		// 剛打完不能擴建
		player.memory.hasBuild = true;
	}
}
