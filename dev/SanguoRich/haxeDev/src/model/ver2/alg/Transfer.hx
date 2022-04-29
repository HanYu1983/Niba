package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.ver2.Config;
import model.ver2.Define;

using Lambda;

// 可能不成的情況是
// 把已經有駐守在別的地方的武將派到這裡來
// 或者前端沒有派任何武將到這個格子上
function _checkValidTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		if (originPeople.position.gridId != null && originPeople.position.gridId != gridId) {
			trace("ModelVer2", "_checkValidTransfer", 'people(${people.id})已經被派駐在grid(${originPeople.position.gridId})');
			return false;
		}
	}
	return true;
}

function _takeTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
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
	}
	applyTransfer(ctx, playerId, gridId, playerInfo, gridInfo);
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

function applyTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
	player.food = playerInfo.food;
	player.army = playerInfo.army;
	player.money = playerInfo.money;
	grid.food = gridInfo.food;
	grid.army = gridInfo.army;
	grid.money = gridInfo.money;
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
