package model.ver2;

import haxe.Exception;
import model.IModel;
import model.GridGenerator;
import model.PeopleGenerator;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

function test() {
	model.ver2.alg.Explore.test();
	model.ver2.alg.Building.test();
	testPayTax();
}

function testPayTax() {
	final ctx:Context = getDefaultContext();
	ctx.grids.push({
		final grid = getDefaultGrid();
		grid;
	});
	final player0 = {
		final player = getDefaultPlayer();
		player.id = 0;
		player;
	};
	final player1 = {
		final player = getDefaultPlayer();
		player.id = 1;
		player;
	};
	ctx.players = [player0, player1];
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.belongToPlayerId = 0;
			people.position.gridId = 0;
			people.energy = 100;
			people;
		}
	];
	if (getGridBelongPlayerId(ctx, 0) != player0.id) {
		throw new haxe.Exception("格子必須是0號player的");
	}

	onPayTaxToGrid(ctx, player1.id, 0);
}
