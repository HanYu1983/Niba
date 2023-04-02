package model.ver2.design;

import haxe.ds.Option;

enum PlayerId {
	A;
	B;
}

enum BaSyou {}

interface ICard {
	function getId():String;
	function getOwner():PlayerId;
	function getController():PlayerId;
}

interface ICardStackID {
	function getPlayerId():PlayerId;
	function getBaSyou():BaSyou;
}

interface ICardStack {
	function getId():ICardStackID;
	function getCards():Array<ICard>;
}

interface ITable {
	function getCards():Array<ICard>;
	function getCardStacks():Array<ICardStack>;
}

class DefaultTable implements ITable {
	public function new() {}

	public function getCards():Array<ICard> {
		return [];
	}

	public function getCardStacks():Array<ICardStack> {
		return [];
	}
}

enum CommandOwner {
	System;
	Player(playerId:PlayerId);
}

enum CommandType {}

enum Timing {
	Default;
}

interface ICommand {
	function getOwner():CommandOwner;
	function getDescription():String;
	function getType():CommandType;
}

interface IEffect {}

interface ICutController {
	function cutIn(effect:IEffect, newCut:Bool):Void;
	function getTop():Option<IEffect>;
}

interface IBattleController {
	function getTable():ITable;
	function getTiming():Timing;
	function getCommands(playerId:PlayerId):Array<ICommand>;
	function setTiming(timing:Timing, force:Bool):Void;
	function getCutController():ICutController;
}

class DefaultBattleController implements IBattleController {
	public function new() {}

	public function getTable():ITable {
		return new DefaultTable();
	}

	public function getTiming():Timing {
		return Default;
	}

	public function setTiming(timing:Timing, force:Bool):Void {}

	public function getCommands(playerId:PlayerId):Array<ICommand> {
		return [];
	}

	public function getCutController():ICutController {
		return null;
	}
}

interface ILobbyController {}

class DefaultLobbyController implements ILobbyController {
	public function new() {}
}

enum CreateCardConfig {
	One(id:String, protoId:String, cardStackId:String);
}

interface IGame {
	function clear():Void;
	function createCard(config:CreateCardConfig):Void;
	function getLobbyController():ILobbyController;
	function getBattleController():IBattleController;
}

class DefaultGame implements IGame {
	public function new() {}

	public function clear():Void {}

	public function createCard(config:CreateCardConfig):Void {}

	public function getLobbyController():ILobbyController {
		return new DefaultLobbyController();
	}

	public function getBattleController():IBattleController {
		return new DefaultBattleController();
	}
}

function testTable(game:IGame) {
	game.createCard(One("", "", ""));
	final table = game.getBattleController().getTable();
}

function testFlow(game:IGame) {
	final ctl = game.getBattleController();
	ctl.setTiming(Default, true);
	final cmds = ctl.getCommands(PlayerId.A);
}

function testCut(game:IGame) {
	final ctr = game.getBattleController().getCutController();
	ctr.cutIn(null, false);
    ctr.getTop();
}

function test(game:IGame) {
	for (fn in [testTable, testFlow, testCut]) {
		game.clear();
		fn(game);
	}
}
