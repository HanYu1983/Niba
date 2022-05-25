package model.ver2;

import model.Config;
import model.tool.Fact;
import model.ver2.Define;

function factIsMyGrid(ctx:Context, playerId:Int, gridId:Int):Float {
	return getFact(getGridBelongPlayerId(ctx, gridId) == playerId ? 9999 : 0);
}

function factIsEnemyGrid(ctx:Context, playerId:Int, gridId:Int):Float {
	return getFact(switch getGridBelongPlayerId(ctx, gridId) {
		case null:
			0;
		case pid if (pid != playerId):
			9999;
		case _:
			0;
	});
}

function factIsNullGrid(ctx:Context, playerId:Int, gridId:Int):Float {
	return getFact(switch getGridBelongPlayerId(ctx, gridId) {
		case null:
			9999;
		case _:
			0;
	});
}

function factGridPeopleMoreThen(ctx:Context, gridId:Int, v:Int):Float {
	final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == gridId);
	return getFact(if (v == 0) {
		if (peopleInGrid.length > 0) {
			9999;
		} else {
			-9999;
		}
	} else {
		peopleInGrid.length / v;
	});
}

function factGridMoneyMoreThen(ctx:Context, gridId:Int, v:Int):Float {
	final grid = ctx.grids[gridId];
	return getFact(if (v == 0) {
		if (grid.money > 0) {
			9999;
		} else {
			-9999;
		}
	} else {
		grid.money / v;
	});
}

function factGridFoodMoreThen(ctx:Context, gridId:Int, v:Int):Float {
	final grid = ctx.grids[gridId];
	return getFact(if (v == 0) {
		if (grid.food > 0) {
			9999;
		} else {
			-9999;
		}
	} else {
		grid.food / v;
	});
}

function factGridArmyMoreThen(ctx:Context, gridId:Int, v:Int):Float {
	final grid = ctx.grids[gridId];
	return getFact(if (v == 0) {
		if (grid.army > 0) {
			9999;
		} else {
			-9999;
		}
	} else {
		grid.army / v;
	});
}

function factGridIsBig(ctx:Context, gridId:Int):Float {
	return factAnd([
		factGridMoneyMoreThen(ctx, gridId, 300),
		factGridFoodMoreThen(ctx, gridId, 300),
		factGridArmyMoreThen(ctx, gridId, 300)
	]);
}

function test() {
	final ctx:Context = getDefaultContext();
	ctx.grids = [
		{
			final grid = getDefaultGrid();
			grid;
		}
	];
	final player0 = {
		final player = getDefaultPlayer();
		player.id = 0;
		player.money = 1000;
		player;
	};
	final player1 = {
		final player = getDefaultPlayer();
		player.id = 1;
		player.money = 1000;
		player;
	};
	ctx.players = [player0, player1];
	if (factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 0) {
		throw new haxe.Exception("factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 0");
	}
	if (factOn(factIsNullGrid(ctx, player0.id, 0), 1) != 1) {
		throw new haxe.Exception("factOn(factIsNullGrid(ctx, player0.id, 0), 1) != 1");
	}
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.belongToPlayerId = player0.id;
			people.position.gridId = 0;
			people.energy = 100;
			people;
		}
	];
	if (factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 1) {
		throw new haxe.Exception("factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 1");
	}
	if (factOn(factIsEnemyGrid(ctx, player0.id, 0), 1) != 0) {
		throw new haxe.Exception("factOn(factIsEnemyGrid(ctx, player0.id, 0), 1) != 0");
	}
	if (factOn(factIsNullGrid(ctx, player0.id, 0), 1) != 0) {
		throw new haxe.Exception("factOn(factIsNullGrid(ctx, player0.id, 0), 1) != 0");
	}
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.belongToPlayerId = player1.id;
			people.position.gridId = 0;
			people.energy = 100;
			people;
		}
	];
	if (factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 0) {
		throw new haxe.Exception("factOn(factIsMyGrid(ctx, player0.id, 0), 1) != 0");
	}
	if (factOn(factIsEnemyGrid(ctx, player0.id, 0), 1) != 1) {
		throw new haxe.Exception("factOn(factIsEnemyGrid(ctx, player0.id, 0), 1) != 1");
	}
	if (factOn(factGridMoneyMoreThen(ctx, 0, 300), 1) != 0) {
		throw new haxe.Exception("factOn(factGridMoneyMoreThen(ctx, player0.id, 300), 1) != 0");
	}
	if (factOn(factGridArmyMoreThen(ctx, 0, 300), 1) != 0) {
		throw new haxe.Exception("factOn(factGridArmyMoreThen(ctx, player0.id, 300), 1) != 0");
	}
	if (factOn(factGridFoodMoreThen(ctx, 0, 300), 1) != 0) {
		throw new haxe.Exception("factOn(factGridFoodMoreThen(ctx, player0.id, 300), 1) != 0");
	}
	ctx.grids = [
		{
			final grid = getDefaultGrid();
			grid.money = 300;
			grid.army = 300;
			grid;
		}
	];
	if (factOn(factGridMoneyMoreThen(ctx, 0, 300), 1) != 1) {
		throw new haxe.Exception("factOn(factGridMoneyMoreThen(ctx, player0.id, 300), 1) != 1");
	}
	if (factOn(factGridArmyMoreThen(ctx, 0, 300), 1) != 1) {
		throw new haxe.Exception("factOn(factGridArmyMoreThen(ctx, player0.id, 300), 1) != 1");
	}
	if (factOn(factGridIsBig(ctx, 0), 1) != 0) {
		throw new haxe.Exception("factOn(factGridIsBig(ctx, 0), 1) != 0");
	}
	ctx.grids = [
		{
			final grid = getDefaultGrid();
			grid.money = 300;
			grid.army = 300;
			grid.food = 300;
			grid;
		}
	];
	if (factOn(factGridFoodMoreThen(ctx, 0, 300), 1) != 1) {
		throw new haxe.Exception("factOn(factGridFoodMoreThen(ctx, player0.id, 300), 1) != 1");
	}
	if (factOn(factGridIsBig(ctx, 0), 1) != 1) {
		throw new haxe.Exception("factOn(factGridIsBig(ctx, 0), 1) != 1");
	}
}
