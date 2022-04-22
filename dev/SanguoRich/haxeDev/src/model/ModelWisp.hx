package model;

import model.DebugModel;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

@:native("getNativeModule") extern class NativeModule {
	public function new():Void;
	public function installPackage(pkg:{gridGenerator:GridGenerator, peopleGenerator:PeopleGenerator}):Void;
	public function gameInfo():Dynamic;
	public function gameStart(cb:Void->Void):Void;
	public function playerDice(cb:() -> Void):Void;
	public function playerEnd(cb:() -> Void):Void;
	public function getTakeWarPreview(playerId:Int, gridId:Int):Dynamic;
	public function takeWarOn(playerId:Int, gridId:Int, cb:(gameInfo:Dynamic) -> Void):Void;
	public function getTakeNegoPreview(playerId:Int, gridId:Int):Dynamic;
	public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void):Void;
	public function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):Dynamic;
	public function getTakeHirePreview(playerId:Int, gridId:Int):Dynamic;
	public function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:Dynamic) -> Void):Void;
	public function getPreResultOfExplore(playerId:Int, gridId:Int, people:People, invite:People):Dynamic;
	public function getRateOfInvitePeople(people:People, invite:People):Float;
}

function native2haxe(nativeInfo:Dynamic):GameInfo {
	return {
		players: nativeInfo.players,
		grids: nativeInfo.grids,
		isPlayerTurn: true, // nativeInfo.currentPlayer == 0,
		currentPlayer: nativeInfo.players[nativeInfo.currentPlayer],
		isPlaying: true,
		events: nativeInfo.events.map(event -> {
			return {
				id: haxe.EnumTools.createByName(EventInfoID, event.id),
				value: event.value
			}
		}),
		actions: nativeInfo.actions.map(action -> {
			return {
				id: haxe.EnumTools.createByName(ActionInfoID, action.id),
				value: action.value,
				gameInfo: native2haxe(action.gameInfo)
			}
		})
	};
}

class ModelWisp extends DebugModel {
	override function gameInfo():GameInfo {
		var nativeInfo = new NativeModule().gameInfo();
		var gameInfo = native2haxe(nativeInfo);
		// 因為是從JS來的資料, 所以即使有定義GameInfo的類型, 還是有可能會出錯
		// 比如明明定義為整數卻是字串的情況
		// 這時就是wisp中的程式碼的問題
		return gameInfo;
	}

	override function gameStart(cb:Void->Void):Void {
		new NativeModule().installPackage({
			gridGenerator: GridGenerator.getInst(),
			peopleGenerator: PeopleGenerator.getInst(),
		});
		return new NativeModule().gameStart(cb);
	}

	override function playerDice(cb:() -> Void) {
		return new NativeModule().playerDice(cb);
	}

	override function playerEnd(cb:() -> Void) {
		return new NativeModule().playerEnd(cb);
	}

	override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return new NativeModule().getTakeWarPreview(playerId, gridId);
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		return new NativeModule().takeWarOn(playerId, gridId, nativeInfo -> {
			var gameInfo = native2haxe(nativeInfo);
			cb(gameInfo);
		});
	}

	override function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return new NativeModule().getTakeNegoPreview(playerId, gridId);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return new NativeModule().takeNegoOn(playerId, gridId, p1SelectId, p2SelectId, nativeInfo -> {
			var gameInfo = native2haxe(nativeInfo);
			cb(gameInfo);
		});
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		return new NativeModule().getPreResultOfNego(playerId, gridId, people, invite);
	}

	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return new NativeModule().getTakeHirePreview(playerId, gridId);
	}

	override function takeHire(playerId:Int, gridId:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return new NativeModule().takeHire(playerId, gridId, p1SelectId, exploreId, nativeInfo -> {
			var gameInfo = native2haxe(nativeInfo);
			cb(gameInfo);
		});
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		return new NativeModule().getPreResultOfExplore(playerId, gridId, people, invite);
	}

	override function getRateOfInvitePeople(people:People, invite:People):Float {
		return new NativeModule().getRateOfInvitePeople(people, invite);
	}
}
