package model.ver2;

import haxe.Exception;
import model.IModel;
import model.GridGenerator;
import model.PeopleGenerator;
import model.ver2.Define;
import model.ver2.alg.Explore;
import model.ver2.alg.Snatch;
import model.ver2.Mock;
import haxe.Serializer;
import haxe.Unserializer;

function test() {
	// testExplore();
	// testGuessArmy();
	// testSerializer();
}
// function testSerializer() {
// 	final ctx:Context = {
// 		grids: [
// 			{
// 				id: 0,
// 				name: "grid0",
// 				buildtype: GROWTYPE.EMPTY,
// 				money: 100.0,
// 				food: 100.0,
// 				army: 100.0,
// 				defaultMoneyGrow: 0.0,
// 				defaultFoodGrow: 0.0,
// 				defaultArmyGrow: 0.0,
// 				favor: [],
// 			}
// 		],
// 		attachments: [],
// 		peoples: [
// 			{
// 				id: 0,
// 				belongToPlayerId: null,
// 				position: {
// 					gridId: null,
// 					player: true
// 				},
// 				name: "0",
// 				force: 50.0,
// 				intelligence: 50.0,
// 				political: 50.0,
// 				charm: 50.0,
// 				cost: 0.0,
// 				command: 50.0,
// 				abilities: [],
// 				energy: 100.0,
// 				defaultType: PeopleType.PUTONG,
// 				exp: 0.0,
// 			}
// 		],
// 		players: [
// 			{
// 				id: 0,
// 				name: "player0",
// 				money: 0.0,
// 				food: 0.0,
// 				army: 1000,
// 				strategy: 0.0,
// 				position: 0,
// 				memory: {
// 					hasDice: false,
// 					hasStrategy: false,
// 					hasCommand: false
// 				}
// 			}
// 		],
// 		currentPlayerId: 0,
// 		actions: [],
// 		events: [],
// 		turn: 0
// 	}
// 	final serializer = new Serializer();
// 	serializer.serialize(ctx);
// 	final memonto = serializer.toString();
// 	trace(memonto);
// 	final unserializer = new Unserializer(memonto);
// 	final nextCtx = (unserializer.unserialize() : Context);
// 	trace(nextCtx);
// }
// function testExplore() {
// 	final ctx:Context = {
// 		grids: [],
// 		attachments: [],
// 		peoples: [
// 			{
// 				id: 0,
// 				belongToPlayerId: null,
// 				position: {
// 					gridId: null,
// 					player: true
// 				},
// 				name: "0",
// 				force: 0.0,
// 				intelligence: 0.0,
// 				political: 0.0,
// 				charm: 50.0,
// 				cost: 0.0,
// 				command: 0.0,
// 				abilities: [],
// 				energy: 100.0,
// 				defaultType: PeopleType.PUTONG,
// 				exp: 0.0,
// 			}
// 		],
// 		players: [],
// 		currentPlayerId: 0,
// 		actions: [],
// 		events: [],
// 		turn: 0
// 	}
// 	final cost = getExploreCost(ctx, 0, 0, 0);
// 	if (cost.successRate <= 0) {
// 		throw new Exception("success must > 0");
// 	}
// 	setRandomMock([cost.successRate / 2]);
// 	final findPeople = applyExploreCost(ctx, 0, 0, 0);
// 	if (findPeople.length <= 0) {
// 		throw new Exception("必須找到人");
// 	}
// }
// function testGuessArmy() {
// 	final ctx:Context = {
// 		grids: [
// 			{
// 				id: 0,
// 				name: "grid0",
// 				buildtype: GROWTYPE.EMPTY,
// 				money: 100.0,
// 				food: 100.0,
// 				army: 100.0,
// 				moneyGrow: 0.0,
// 				foodGrow: 0.0,
// 				armyGrow: 0.0,
// 				favor: [],
// 			}
// 		],
// 		attachments: [],
// 		peoples: [
// 			{
// 				id: 0,
// 				belongToPlayerId: null,
// 				position: {
// 					gridId: null,
// 					player: true
// 				},
// 				name: "0",
// 				force: 50.0,
// 				intelligence: 50.0,
// 				political: 50.0,
// 				charm: 50.0,
// 				cost: 0.0,
// 				command: 50.0,
// 				abilities: [],
// 				energy: 100.0,
// 				defaultType: PeopleType.PUTONG,
// 				exp: 0.0,
// 			}
// 		],
// 		players: [
// 			{
// 				id: 0,
// 				name: "player0",
// 				money: 0.0,
// 				food: 0.0,
// 				army: 1000,
// 				strategy: 0.0,
// 				position: 0
// 			}
// 		],
// 		currentPlayerId: 0,
// 		actions: [],
// 		events: [],
// 		turn: 0
// 	}
// 	final result = guessArmy(ctx, 0, 0, 0, 0);
// 	trace(result);
// }
