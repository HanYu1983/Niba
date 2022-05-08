package model;

import model.GridGenerator.GROWTYPE;
import model.GridGenerator.BUILDING;
import model.IModel;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class ProxyModel implements IModel {
	private var model:IModel;

	public function new(m:IModel) {
		model = m;
	}

	public function getPeople(count:Int):Array<People> {
		return model.getPeople(count);
	}

	public function gameStart(cb:Void->Void):Void {
		return model.gameStart(cb);
	}

	public function gameInfo():GameInfo {
		return model.gameInfo();
	}

	public function playerDice(cb:() -> Void) {
		return model.playerDice(cb);
	}

	public function playerEnd(cb:() -> Void) {
		return model.playerEnd(cb);
	}

	public function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return model.getTakeWarPreview(playerId, gridId);
	}

	public function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeWarOn(playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, cb);
	}

	public function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return model.getTakeNegoPreview(playerId, gridId);
	}

	public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeNegoOn(playerId, gridId, p1SelectId, p2SelectId, cb);
	}

	public function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return model.getTakeHirePreview(playerId, gridId);
	}

	public function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeHire(playerId, gridInt, p1SelectId, exploreId, cb);
	}

	public function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		return model.getPreResultOfNego(playerId, gridId, people, invite);
	}

	public function getPreResultOfHire(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		return model.getPreResultOfHire(playerId, gridId, people, invite);
	}

	public function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar> {
		return model.getPreResultOfWar(playerId, gridId, p1, p2, army1, army2);
	}

	public function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return model.getTakeExplorePreview(playerId, gridId);
	}

	public function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore {
		return model.getPreResultOfExplore(playerId, gridId, p1);
	}

	public function takeExplore(playerId:Int, gridId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeExplore(playerId, gridId, p1PeopleId, cb);
	}

	public function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
		return model.getTakeResourcePreview(playerId, gridId, market, type);
	}

	public function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource {
		return model.getPreResultOfResource(playerId, gridId, p1, market, type);
	}

	public function takeResource(playerId:Int, gridId:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeResource(playerId, gridId, p1PeopleId, market, type, cb);
	}

	public function getPreResultOfFire(playerId:Int, p1PeopleId:Array<Int>):PreResultOnFire {
		return model.getPreResultOfFire(playerId, p1PeopleId);
	}

	public function takeFire(playerId:Int, p1PeopleId:Array<Int>, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeFire(playerId, p1PeopleId, cb);
	}

	public function checkValidTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid):Bool {
		return model.checkValidTransfer(playerId, gridInt, playerInfo, gridInfo);
	}

	public function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeTransfer(playerId, gridInt, playerInfo, gridInfo, cb);
	}

	public function getTakeSnatchPreview(playerId:Int, gridId:Int):SnatchPreview {
		return model.getTakeSnatchPreview(playerId, gridId);
	}

	public function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:People, p2:People, isOccupation:Bool):PreResultOnSnatch {
		return model.getPreResultOfSnatch(playerId, gridId, p1, p2, isOccupation);
	}

	public function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeSnatchOn(playerId, gridId, p1PeopleId, p2PeopleId, isOccupation, cb);
	}

	public function getStrategyRate(p1People:People, strategy:StrategyCatelog, targetPlayerId:Int, targetPeopleId:Int,
			targetGridId:Int):{energyBefore:Int, energyAfter:Int, rate:Float} {
		return model.getStrategyRate(p1People, strategy, targetPlayerId, targetPeopleId, targetGridId);
	}

	public function takeStrategy(p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int,
			cb:(gameInfo:GameInfo) -> Void):Void {
		return model.takeStrategy(p1PeopleId, strategyId, targetPlayerId, targetPeopleId, targetGridId, cb);
	}

	public function takeBuilding(p1PeopleId:Int, gridId:Int, peopleId:Int, current:Dynamic, to:Dynamic, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeBuilding(p1PeopleId, gridId, peopleId, current, to, cb);
	}

	public function getResultOfCost(p1Player:PlayerInfo, p1People:People, costType:Int):{
		costFood:Float,
		costMoney:Float,
		gainExp:Float,
		gainEnergy:Float
	} {
		return model.getResultOfCost(p1Player, p1People, costType);
	}

	public function takeCostForBonus(playerId:Int, peopleId:Int, costType:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeCostForBonus(playerId, peopleId, costType, cb);
	}

	public function save(cb:(success:Bool) -> Void) {
		return model.save(cb);
	}

	public function load(cb:(success:Bool, gameInfo:GameInfo) -> Void) {
		return model.load(cb);
	}

	public function getPreResultOfPk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):{
		energyBefore:Int,
		energyAfter:Int,
		armyChange:Int,
		successRate:Float
	} {
		return model.getPreResultOfPk(playerId, gridId, p1PeopleId, p2PeopleId);
	}

	public function takePk(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, syncViewByInfo:(gameInfo:GameInfo) -> Void) {
		return model.takePk(playerId, gridId, p1PeopleId, p2PeopleId, syncViewByInfo);
	}

	public function getUnEquipResult(p1:People, unequipId:Int):{peopleBefore:People, peopleAfter:People} {
		return model.getUnEquipResult(p1, unequipId);
	}

	public function getEquipResult(p1:People, equipId:Int):{peopleBefore:People, peopleAfter:People} {
		return model.getEquipResult(p1, equipId);
	}

	public function takeEquip(p1:People, equipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeEquip(p1, equipId, cb);
	}

	public function takeUnEquip(p1:People, unequipId:Int, cb:(gameInfo:GameInfo) -> Void) {
		return model.takeUnEquip(p1, unequipId, cb);
	}

	public function getPeopleById(id:Int):People {
		return PeopleGenerator.getInst().generate();
	}
}
