package model;

import model.GridGenerator.GROWTYPE;
import model.GridGenerator.BUILDING;
import model.IModel;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

// 快取用Model
// 注意: 在任何有副作用的方法都要覆寫isDirty = true
class CacheModel extends ProxyModel {
	private var cache:GameInfo;
	private var isDirty:Bool;

	public function new(m:IModel) {
		super(m);
	}

	override function gameInfo():GameInfo {
		if (cache == null) {
			cache = super.gameInfo();
			js.Browser.console.log("CacheModel", cache);
			return cache;
		}
		if (isDirty) {
			cache = super.gameInfo();
			js.Browser.console.log("CacheModel", cache);
			isDirty = false;
			return cache;
		}
		// js.Browser.console.log("CacheModel", "use cache", cache);
		return cache;
	}

	override function playerDice(cb:() -> Void) {
		isDirty = true;
		return super.playerDice(cb);
	}

	override function playerEnd(cb:() -> Void) {
		isDirty = true;
		return super.playerEnd(cb);
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeWarOn(playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, cb);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeNegoOn(playerId, gridId, p1SelectId, p2SelectId, cb);
	}

	override function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeHire(playerId, gridInt, p1SelectId, exploreId, cb);
	}

	override function takeExplore(playerId:Int, gridId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeExplore(playerId, gridId, p1PeopleId, cb);
	}

	override function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeResource(playerId, gridId, p1PeopleId, market, type, cb);
	}

	override function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeFire(playerId, p1PeopleId, cb);
	}

	override function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeTransfer(playerId, gridInt, playerInfo, gridInfo, cb);
	}

	override function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeSnatchOn(playerId, gridId, p1PeopleId, p2PeopleId, isOccupation, cb);
	}

	override function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int,
			cb:(gameInfo:GameInfo) -> Void):Void {
		isDirty = true;
		return super.takeStrategy(p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId, cb);
	}

	override function takeBuilding(p1PeopleId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeBuilding(p1PeopleId, gridId, peopleId, current, to, cb);
	}

	override function takeCostForBonus(playerId:Int, peopleId:Int, costType:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeCostForBonus(playerId, peopleId, costType, cb);
	}

	override function load(cb:(success:Bool, gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.load(cb);
	}

	override function takePk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, syncViewByInfo:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takePk(playerId, gridId, p1PeopleId, p2PeopleId, syncViewByInfo);
	}

	override function takeEquip(p1:People, equipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeEquip(p1, equipId, cb);
	}

	override function takeUnEquip(p1:People, unequipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeUnEquip(p1, unequipId, cb);
	}

	override function refresh(cb:() -> Void) {
		isDirty = true;
		return super.refresh(cb);
	}

	override function finishOneEvent(syncView:() -> Void) {
		isDirty = true;
		return super.finishOneEvent(syncView);
	}
}
