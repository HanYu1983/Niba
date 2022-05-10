package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

private function onFire(ctx:Context, playerId:Int, peopleIds:Array<Int>) {
	final resultValue = {
		success: true,
		people: peopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p)),
		maintainMoneyAfter: 0.0,
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
	final gridId = ctx.players[playerId].position;
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	for (peopleId in peopleIds) {
		final people = getPeopleById(ctx, peopleId);
		people.belongToPlayerId = null;
		final isNotMyGrid = gridBelongPlayerId != people.belongToPlayerId;
		if (isNotMyGrid) {
			people.position.gridId = null;
		} else {
			people.position.gridId = ctx.players[playerId].position;
		}
	}
	resultValue.maintainMoneyAfter = getMaintainPeople(ctx, playerId);
	ctx.events.push(Event.FIRE_RESULT(resultValue));
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
