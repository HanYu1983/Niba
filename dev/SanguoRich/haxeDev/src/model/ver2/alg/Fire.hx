package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

private function onFire(ctx:Context, playerId:Int, peopleIds:Array<Int>) {
	final gridId = ctx.players[playerId].position;
	final resultValue = {
		success: true,
		people: peopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p)),
		maintainMoneyAfter: 0.0,
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
		gridId: gridId,
	}
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	for (peopleId in peopleIds) {
		final people = getPeopleById(ctx, peopleId);
		// 解雇
		people.belongToPlayerId = null;
		if (gridBelongPlayerId == null) {
			// 中立格子就進入
			people.position.gridId = gridId;
		} else {
			// 非中立格子的話, 武將就消失
			people.position.gridId = null;
		}
		// 拆除武將身上的寶物
		final equipTreasures = ctx.treasures.filter(t -> t.position.peopleId == people.id);
		for (t in equipTreasures) {
			t.position.peopleId = null;
		}
	}
	resultValue.maintainMoneyAfter = getMaintainPeople(ctx, playerId);
	ctx.events.push(FIRE_RESULT(resultValue, getGameInfo(ctx, false)));
}

function _getPreResultOfFire(ctx:Context, playerId:Int, peopleIds:Array<Int>):PreResultOnFire {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		if (peopleIds.has(p.id)) {
			return a;
		}
		return a + getPeopleMaintainCost(ctx, p.id);
	}, 0.0);
	return {
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

function _takeFire(ctx:Context, playerId:Int, peopleIds:Array<Int>) {
	onFire(ctx, playerId, peopleIds);
}
