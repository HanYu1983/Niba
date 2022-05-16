package model.ver2;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.Nego;
import model.ver2.alg.Hire;
import model.ver2.alg.Explore;
import model.ver2.alg.War;
import model.ver2.alg.Resource;
import model.ver2.alg.Fire;
import model.ver2.alg.Snatch;
import model.ver2.alg.Transfer;
import model.ver2.alg.Strategy;
import model.ver2.alg.Building;
import model.ver2.alg.CostForBonus;
import model.ver2.alg.SaveLoad;
import model.ver2.alg.Pk;
import model.ver2.alg.Equip;

class ModelVer2 extends DebugModel {
	var context:Context = {
		grids: [],
		attachments: [],
		peoples: [],
		players: [],
		currentPlayerId: 0,
		events: [],
		groundItems: [],
		treasures: [],
		turn: 0
	}

	override function gameStart(setting:GameSetting, cb:Void->Void):Void {
		initContext(context, {});
		cb();
	}

	override function gameInfo():GameInfo {
		final info = getGameInfo(context, true);
		return info;
	}

	override function getPeopleById(id:Int):model.PeopleGenerator.People {
		return Define.getPeopleInfo(context, Define.getPeopleById(context, id));
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

	override function getPreResultOfFire(playerId:Int, p1PeopleId:Array<Int>):PreResultOnFire {
		return _getPreResultOfFire(context, playerId, p1PeopleId);
	}

	override function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void) {
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

	override function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:model.PeopleGenerator.People, p2:model.PeopleGenerator.People,
			isOccupation:Bool):PreResultOnSnatch {
		return _getPreResultOfSnatch(context, playerId, gridId, p1.id, p2.id, isOccupation);
	}

	override function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void) {
		_takeSnatchOn(context, playerId, gridId, p1PeopleId, p2PeopleId, isOccupation);
		cb(gameInfo());
	}

	override function getStrategyRate(p1People:model.PeopleGenerator.People, strategy:StrategyCatelog, targetPlayerId:Int, targetPeopleId:Int,
			targetGridId:Int):{
		energyBefore:Int,
		energyAfter:Int,
		rate:Float
	} {
		return _getStrategyRate(context, p1People.id, strategy.id, targetPlayerId, targetPeopleId, targetGridId);
	}

	override function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int,
			cb:(gameInfo:GameInfo) -> Void):Void {
		_takeStrategy(context, p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId);
		cb(gameInfo());
	}

	override function takeBuilding(playerId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic, cb:(gameInfo:GameInfo) -> Void) {
		_takeBuilding(context, playerId, gridId, peopleId, current, to);
		cb(gameInfo());
	}

	override function getResultOfCost(p1Player:PlayerInfo, p1People:model.PeopleGenerator.People, costType:Int):{
		costFood:Float,
		costMoney:Float,
		gainExp:Float,
		gainEnergy:Float
	} {
		final ret = _getResultOfCost(context, p1Player, p1People, costType);
		return ret;
	}

	override function takeCostForBonus(playerId:Int, peopleId:Int, costType:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeCostForBonus(context, playerId, peopleId, costType);
		cb(gameInfo());
	}

	override function save(cb:(success:Bool) -> Void) {
		try {
			_save(context);
			cb(true);
		} catch (e:haxe.Exception) {
			js.Browser.console.log("ModelVer2", "save", e);
			cb(false);
		}
	}

	override function load(cb:(success:Bool, gameInfo:GameInfo) -> Void) {
		try {
			final loadCtx = _load();
			if (loadCtx == null) {
				return cb(false, gameInfo());
			}
			context = loadCtx;
			cb(true, gameInfo());
		} catch (e:haxe.Exception) {
			js.Browser.console.log("ModelVer2", "load", e);
			cb(false, gameInfo());
		}
	}

	override function getPreResultOfPk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):{
		energyBefore:Int,
		energyAfter:Int,
		armyChange:Int,
		successRate:Float
	} {
		return _getPreResultOfPk(context, playerId, gridId, p1PeopleId, p2PeopleId);
	}

	override function takePk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, syncViewByInfo:(gameInfo:GameInfo) -> Void) {
		_takePk(context, playerId, gridId, p1PeopleId, p2PeopleId);
		syncViewByInfo(gameInfo());
	}

	override function getUnEquipResult(p1:model.PeopleGenerator.People,
			unequipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
		return _getUnEquipResult(context, p1, unequipId);
	}

	override function getEquipResult(p1:model.PeopleGenerator.People,
			equipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
		return _getEquipResult(context, p1, equipId);
	}

	override function takeEquip(p1:model.PeopleGenerator.People, equipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeEquip(context, p1, equipId);
		cb(gameInfo());
	}

	override function takeUnEquip(p1:model.PeopleGenerator.People, unequipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		_takeUnEquip(context, p1, unequipId);
		cb(gameInfo());
	}

	override function refresh(cb:() -> Void) {
		context.events = [];
		cb();
	}

	override function finishOneEvent(syncView:() -> Void) {
		context.events.shift();
		syncView();
	}
}
