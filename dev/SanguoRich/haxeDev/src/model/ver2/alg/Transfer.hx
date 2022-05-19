package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

private function onTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		// 轉型後才能編譯器才知道要檢查null
		people: (null : Null<model.PeopleGenerator.People>),
		energyBefore: 0.0,
		energyAfter: 0.0,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
		gridId: gridId,
	}
	{
		final grid = ctx.grids[gridId];
		player.food = playerInfo.food;
		player.army = playerInfo.army;
		player.money = playerInfo.money;
		grid.food = gridInfo.food;
		grid.army = gridInfo.army;
		grid.money = gridInfo.money;
		// 超過的部分拿回來
		final offsetMoney = grid.money - getGridMaxMoney(ctx, grid.id);
		if (offsetMoney > 0) {
			player.money += offsetMoney;
			grid.money = getGridMaxMoney(ctx, grid.id);
		}
		final offsetFood = grid.food - getGridMaxFood(ctx, grid.id);
		if (offsetFood > 0) {
			player.food += offsetFood;
			grid.food = getGridMaxFood(ctx, grid.id);
		}
		final offsetArmy = grid.army - getGridMaxArmy(ctx, grid.id);
		if (offsetArmy > 0) {
			player.army += offsetArmy;
			grid.army = getGridMaxArmy(ctx, grid.id);
		}
		// 在同一格的情況, 離開城池
		for (people in playerInfo.people) {
			final originPeople = getPeopleById(ctx, people.id);
			if (originPeople.position.gridId == gridId) {
				originPeople.position.gridId = null;
			}
		}
		// 進入城池
		for (people in gridInfo.people) {
			final originPeople = getPeopleById(ctx, people.id);
			originPeople.position.gridId = gridId;
		}
	}
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events.push(RESOURCE_RESULT(resultValue, getGameInfo(ctx, false)));
}

// 可能不成的情況是
// 把已經有駐守在別的地方的武將派到這裡來
// 或者前端沒有派任何武將到這個格子上
function _checkValidTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);

	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		// final isNotMyGrid = gridBelongPlayerId != originPeople.belongToPlayerId;
		// if (isNotMyGrid) {
		// 	trace("ModelVer2", "_checkValidTransfer", 'people(${people.id})無法進入非自己的城池');
		// 	return false;
		// }
		if (originPeople.position.gridId != null && originPeople.position.gridId != gridId) {
			trace("ModelVer2", "_checkValidTransfer", 'people(${people.id})已經被派駐在grid(${originPeople.position.gridId})');
			return false;
		}
	}
	return true;
}

function _takeTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	onTransfer(ctx, playerId, gridId, playerInfo, gridInfo);
	sortEventWhenRealPlayer(ctx);
}
