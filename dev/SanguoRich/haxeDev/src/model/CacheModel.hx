package model;

import model.GridGenerator.GROWTYPE;
import model.GridGenerator.BUILDING;
import model.IModel;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;
import tool.Debug;

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
			info("CacheModel", cache);
			return cache;
		}
		if (isDirty) {
			cache = super.gameInfo();
			info("CacheModel", cache);
			isDirty = false;
			return cache;
		}
		return cache;
	}

	override function gameStart(setting:GameSetting, cb:Void->Void):Void {
		isDirty = true;
		return super.gameStart(setting, cb);
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

	override function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, moreMoney:Float, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeHire(playerId, gridInt, p1SelectId, exploreId, moreMoney, cb);
	}

	override function takeExplore(playerId:Int, gridId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeExplore(playerId, gridId, p1PeopleId, cb);
	}

	override function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, moneyBase:Float, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeResource(playerId, gridId, p1PeopleId, moneyBase, market, type, cb);
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

	override function takeSettle(playerId:Int, peopleId:Int, gridId:Int, settleType:Int, syncViewWithEventsByGameInfo:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.takeSettle(playerId, peopleId, gridId, settleType, syncViewWithEventsByGameInfo);
	}

	override function sellTreasure(playerId:Int, gridId:Int, sellId:Int, syncViewWithEventsByGameInfo:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.sellTreasure(playerId, gridId, sellId, syncViewWithEventsByGameInfo);
	}

	override function buyTreasure(playerId:Int, gridId:Int, buyId:Int, syncViewWithEventsByGameInfo:(gameInfo:GameInfo) -> Void) {
		isDirty = true;
		return super.buyTreasure(playerId, gridId, buyId, syncViewWithEventsByGameInfo);
	}
}
