package model.ver2;

import haxe.Exception;
import model.IModel;
import model.GridGenerator;
import model.PeopleGenerator;
import model.ver2.Define;
import model.tool.Mock;
import model.ver2.alg.Alg;
import model.ver2.alg.Brain;
import model.ver2.alg.AlgPlayer;

using Lambda;

final getDefaultBrainMemory = model.ver2.alg.Brain.privateExport.getDefaultBrainMemory;
final getCommandWeight = model.ver2.alg.Brain.privateExport.getCommandWeight;

function test() {
	model.ver2.alg.AlgPlayer.test();
	model.ver2.alg.Brain.test();
	model.ver2.alg.Settle.test();
	model.ver2.BrainTool.test();
	model.ver2.alg.TreasureBuySell.test();
	model.ver2.alg.Explore.test();
	model.ver2.alg.Building.test();
	testPayTax();
	testBrainCommandWeight();
	testTreasureMarketCommand();
}

function testTreasureMarketCommand() {
	final ctx:Context = getDefaultContext();
	final grid0:Grid = {
		final grid = getDefaultGrid();
		grid.id = 0;
		grid;
	}
	ctx.grids = [grid0];
	final attach0 = {
		final tmp = getDefaultAttachment();
		tmp.id = 0;
		tmp.type = TREASURE(0);
		tmp.belongToGridId = grid0.id;
		tmp;
	}
	ctx.attachments = [attach0];
	final player0 = {
		final player = getDefaultPlayer();
		player.id = 0;
		trace("假設玩家已經移動");
		player.memory.hasDice = true;
		player;
	};
	ctx.players = [player0];
	{
		final cmds = getPlayerCommand(ctx, player0.id);
		if (cmds.has(TREASURE_MARKET) != false) {
			throw new haxe.Exception("0級不會出現TREASUER_MARKET指令");
		}
	}
	trace("升級寶物交易所");
	attach0.type = TREASURE(1);
	{
		final cmds = getPlayerCommand(ctx, player0.id);
		if (cmds.has(TREASURE_MARKET) != true) {
			throw new haxe.Exception("1級應要出現TREASUER_MARKET指令");
		}
	}
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

function testBrainCommandWeight() {
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
		player.brain = {
			memory: getDefaultBrainMemory()
		}
		player.money = 1000;
		player;
	};
	ctx.players = [player0];
	ctx.peoples = [
		{
			final people = getDefaultPeople();
			people.belongToPlayerId = player0.id;
			people.position.gridId = 0;
			people.energy = 100;
			people;
		}
	];
	final w = getCommandWeight(ctx, player0.id, 0, STRATEGY);
	trace(w);
}
