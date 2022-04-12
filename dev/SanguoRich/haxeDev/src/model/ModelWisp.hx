package model;

import model.DebugModel;
import model.IModel.GameInfo;
import model.IModel.ActionInfoID;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

@:native("getNativeModule") extern class NativeModule {
	public function new():Void;
	public function installPackage(pkg:{gridGenerator:GridGenerator, peopleGenerator:PeopleGenerator}):Void;
	public function gameInfo():Dynamic;
	public function gameStart(cb:Void->Void):Void;
	public function playerDice(cb:() -> Void):Void;
	public function playerEnd(cb:() -> Void):Void;
}

function native2haxe(nativeInfo:Dynamic):GameInfo {
	return {
		players: nativeInfo.players,
		grids: nativeInfo.grids,
		isPlayerTurn: nativeInfo.currentPlayer == 0,
		currentPlayer: nativeInfo.players[nativeInfo.currentPlayer],
		isPlaying: true,
		events: [],
		actions: [
			// {
			// 	id: haxe.EnumTools.createByName(ActionInfoID, "MOVE"),
			// 	value: {
			// 		playerId: 0,
			// 		fromGridId: 5,
			// 		toGridId: 10
			// 	},
			// 	gameInfo: gameInfo()
			// }
		]
	};
}

class ModelWisp extends DebugModel {
	public override function gameInfo():GameInfo {
		var nativeInfo = new NativeModule().gameInfo();
		trace("[ModelWisp][gameInfo]");
		trace(nativeInfo);
		return native2haxe(nativeInfo);
	}

	public override function gameStart(cb:Void->Void):Void {
		new NativeModule().installPackage({
			gridGenerator: GridGenerator.getInst(),
			peopleGenerator: PeopleGenerator.getInst(),
		});
		return new NativeModule().gameStart(cb);
	}

	public override function playerDice(cb:() -> Void) {
		return new NativeModule().playerDice(cb);
	}

	public override function playerEnd(cb:() -> Void) {
		return new NativeModule().playerEnd(cb);
	}
}
