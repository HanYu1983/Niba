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
			cache = model.gameInfo();
			return cache;
		}
		if (isDirty) {
			cache = model.gameInfo();
			isDirty = false;
			return cache;
		}
		return cache;
	}

	override function playerDice(cb:() -> Void) {
		isDirty = true;
		return model.playerDice(cb);
	}

	override function playerEnd(cb:() -> Void) {
		isDirty = true;
		return model.playerEnd(cb);
	}

	override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeWarOn(playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, cb);
	}

	override function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeNegoOn(playerId, gridId, p1SelectId, p2SelectId, cb);
	}

	override function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeHire(playerId, gridInt, p1SelectId, exploreId, cb);
	}

	override function takeExplore(playerId:Int, gridId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeExplore(playerId, gridId, p1PeopleId, cb);
	}

	override function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeResource(playerId, gridId, p1PeopleId, market, type, cb);
	}

	override function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeFire(playerId, p1PeopleId, cb);
	}

	override function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeTransfer(playerId, gridInt, playerInfo, gridInfo, cb);
	}

	override function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return model.takeSnatchOn(playerId, gridId, p1PeopleId, p2PeopleId, isOccupation, cb);
	}

	override function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int,
			cb:(gameInfo:GameInfo) -> Void):Void {
		isDirty = true;
		return model.takeStrategy(p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId, cb);
	}
}
