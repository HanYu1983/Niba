package model.ver2;

import haxe.Exception;
import model.ver2.Define;
import model.ver2.alg.Explore;
import model.ver2.Mock;

function test() {
	testExplore();
}

function testExplore() {
	final ctx:Context = {
		grids: [],
		attachments: [],
		peoples: [
			{
				id: 0,
				belongToPlayerId: null,
				position: {
					gridId: null,
					player: true
				},
				name: "0",
				force: 0.0,
				intelligence: 0.0,
				political: 0.0,
				charm: 50.0,
				cost: 0.0,
				command: 0.0,
				abilities: [],
				energy: 100.0,
			}
		],
		players: [],
		currentPlayerId: 0,
		actions: [],
		events: [],
		turn: 0
	}
	final cost = getExploreCost(ctx, 0, 0, 0);
	if (cost.successRate <= 0) {
		throw new Exception("success must > 0");
	}
	setRandomMock([cost.successRate / 2]);
	final findPeople = applyExploreCost(ctx, 0, 0, 0);
	if (findPeople.length <= 0) {
		throw new Exception("必須找到人");
	}
}
