package model.ver2;

import model.IModel.PreResultOnSnatch;
import model.IModel.SnatchPreview;
import model.IModel.PreResultOnFire;
import model.IModel.PreResultOnResource;
import model.IModel.ResourcePreview;
import model.IModel.MARKET;
import model.IModel.RESOURCE;
import model.IModel.GameInfo;
import model.GridGenerator.BUILDING;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnWar;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.ver2.Config;
import model.ver2.Define;
import model.ver2.Alg;

class ModelVer2 extends DebugModel {
	final context:Context = {
		grids: [],
		attachments: [],
		peoples: [],
		players: [],
		currentPlayerId: 0,
		actions: [],
		events: [],
		turn: 0
	}

	override function gameStart(cb:Void->Void):Void {
		initContext(context, {});
		cb();
	}

	override function gameInfo():GameInfo {
		final info = getGameInfo(context, true);
		js.Browser.console.log(info);
		return info;
	}

	override function playerDice(cb:() -> Void) {
		doPlayerDice(context);
		cb();
	}

	override function playerEnd(cb:() -> Void) {
		doPlayerEnd(context);
		cb();
	}

	override function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return doGetTakeNegoPreview(context, playerId, gridId);
	}

	override function getPreResultOfNego(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnNego {
		return doGetPreResultOfNego(context, playerId, gridId, people.id, invite.id);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeNegoOn(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}

	override function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return doGetTakeHirePreview(context, playerId, gridId);
	}

	override function getPreResultOfHire(playerId:Int, gridId:Int, people:model.PeopleGenerator.People, invite:model.PeopleGenerator.People):PreResultOnHire {
		return doGetPreResultOfHire(context, playerId, gridId, people.id, invite.id);
	}

	override function takeHire(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		doTakeHire(context, playerId, gridId, p1SelectId, p2SelectId);
		cb(gameInfo());
	}

	override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return _getTakeExplorePreview(context, playerId, gridId);
	}

	override function getPreResultOfExplore(playerId:Int, gridId:Int, people:model.PeopleGenerator.People):PreResultOnExplore {
		return _getPreResultOfExplore(context, playerId, gridId, people.id);
	}

	override function takeExplore(playerId:Int, gridId:Int, p1SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeExplore(context, playerId, gridId, p1SelectId);
		cb(gameInfo());
	}

	override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return _getTakeWarPreview(context, playerId, gridId);
	}

	override function getPreResultOfWar(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, p2:model.PeopleGenerator.People, army1:Float,
			army2:Float):Array<PreResultOnWar> {
		return _getPreResultOfWar(context, playerId, gridId, p1.id, p2.id, army1, army2, {occupy: true});
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		_takeWarOn(context, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
		cb(gameInfo());
	}

	override function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
		return _getTakeResourcePreview(context, playerId, gridId, market, type);
	}

	override function getPreResultOfResource(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, market:MARKET, type:RESOURCE):PreResultOnResource {
		return _getPreResultOfResource(context, playerId, gridId, p1.id, market, type);
	}

	override function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		_takeResource(context, playerId, gridId, p1PeopleId, market, type);
		cb(gameInfo());
	}

	override function getPreResultOfFire(playerId:Int, p1PeopleId:Int):PreResultOnFire {
		return _getPreResultOfFire(context, playerId, p1PeopleId);
	}

	override function takeFire(playerId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeFire(context, playerId, p1PeopleId);
		cb(gameInfo());
	}

	override function checkValidTransfer(playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
		js.Browser.console.log(playerInfo, gridInfo);
		return _checkValidTransfer(context, playerId, gridId, playerInfo, gridInfo);
	}

	override function takeTransfer(playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid,
			cb:(gameInfo:GameInfo) -> Void) {
		_takeTransfer(context, playerId, gridId, playerInfo, gridInfo);
		cb(gameInfo());
	}

	override function getTakeSnatchPreview(playerId:Int, gridId:Int):SnatchPreview {
		return _getTakeSnatchPreview(context, playerId, gridId);
	}

	override function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, p2:model.PeopleGenerator.People):PreResultOnSnatch {
		return _getPreResultOfSnatch(context, playerId, gridId, p1.id, p2.id);
	}

	override function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeSnatchOn(context, playerId, gridId, p1PeopleId, p2PeopleId);
		cb(gameInfo());
	}
}
