package model;

import model.ver2.Define.Strategy;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

typedef PlayerInfo = {
    id:Int,
    name:String,
    money:Float,
    food:Float,
    army:Float,
    strategy:Float,
    people:Array<People>,
    grids:Array<Grid>,
    atGridId:Int,
    maintainPeople:Float,
    maintainArmy:Float
}

enum ActionInfoID {
    MOVE;
}

typedef ActionInfo = {
    id:ActionInfoID,
    value:Dynamic,
    gameInfo:GameInfo
}

enum EventInfoID {
    WORLD_EVENT;
    WALK_STOP;
    NEGOTIATE_RESULT;
    EXPLORE_RESULT;
    HIRE_RESULT;
    FIRE_RESULT;
    WAR_RESULT;
    SNATCH_RESULT;
    RESOURCE_RESULT;
}

enum MARKET {
    BUY;
    SELL;
}

enum RESOURCE {
    MONEY;
    FOOD;
    ARMY;
    STRETEGY;
}

typedef EventInfo = {
    id:EventInfoID,
    value:Dynamic
}

typedef GameInfo = {
    players:Array<PlayerInfo>,
    grids:Array<Grid>,
    isPlayerTurn:Bool,
    currentPlayer:PlayerInfo,
    isPlaying:Bool,
    events:Array<EventInfo>,
    actions:Array<ActionInfo>,
}

typedef SnatchPreview = {
    p1ValidPeople:Array<People>,
    p2ValidPeople:Array<People>,
    isP1ArmyValid:Bool,
    isP2ArmyValid:Bool,
}

typedef WarPreview = {
    p1:PlayerInfo,
    p2:PlayerInfo,
    p1ValidPeople:Array<People>,
    p2ValidPeople:Array<People>,
}

typedef NegoPreview = {
    p1ValidPeople:Array<People>,
    p2ValidPeople:Array<People>,
}

typedef HirePreview = {
    p1ValidPeople:Array<People>,
    p2ValidPeople:Array<People>,
}

typedef PreResultOnNego = {
    energyBefore:Int,
    energyAfter:Int,
    armyBefore:Int,
    armyAfter:Int,
    moneyBefore:Int,
    moneyAfter:Int,
    foodBefore:Int,
    foodAfter:Int,
    maintainFoodBefore:Float,
    maintainFoodAfter:Float,
    successRate:Float
} 

typedef PreResultOnWar = {
    energyBefore:Int,
    energyAfter:Int,
    armyBefore:Int,
    armyAfter:Int,
    moneyBefore:Int,
    moneyAfter:Int,
    foodBefore:Int,
    foodAfter:Int,
    maintainFoodBefore:Float,
    maintainFoodAfter:Float,
} 

typedef PreResultOnSnatch = {
    war:Array<PreResultOnWar>,
    money:Float,
    food:Float,
}

typedef PreResultOnHire = {
    energyBefore:Int,
    energyAfter:Int,
    moneyBefore:Float,
    moneyAfter:Float,
    maintainMoneyBefore:Float,
    maintainMoneyAfter:Float,
    successRate:Float
}
// }

typedef ExplorePreview = {
    p1ValidPeople:Array<People>,
}

typedef PreResultOnExplore = {
    energyBefore:Int,
    energyAfter:Int,
    successRate:Float
}

typedef ResourcePreview = {
    p1ValidPeople:Array<People>,
}

typedef PreResultOnResource = {
    energyBefore:Int,
    energyAfter:Int,
    armyBefore:Int,
    armyAfter:Int,
    moneyBefore:Int,
    moneyAfter:Int,
    foodBefore:Int,
    foodAfter:Int,
    maintainFoodBefore:Float,
    maintainFoodAfter:Float,
}

typedef PreResultOnFire = {
    maintainMoneyBefore:Float,
    maintainMoneyAfter:Float,
}

interface IModel{
    function gameStart(cb:Void->Void):Void;
    function gameInfo():GameInfo;
    function getPeople(count:Int):Array<People>;
    function playerDice(cb:Void->Void):Void;
    function playerEnd(cb:()->Void):Void;
    
    function getPreResultOfFire(playerId:Int, p1PeopleId:Int):PreResultOnFire;
    function takeFire(playerId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview;
    function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar>;
    function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo)->Void):Void;
    
    function getTakeSnatchPreview(playerId:Int, gridId:Int):SnatchPreview;
    function getPreResultOfSnatch(playerId:Int, gridId:Int, p1:People, p2:People, isOccupation:Bool):PreResultOnSnatch;
    function takeSnatchOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, isOccupation:Bool, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview;
    function getPreResultOfNego(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnNego;
    function takeNegoOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview;
    function getPreResultOfHire(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnHire;
    function takeHire(playerId:Int, gridInt:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview;
    function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore;
    function takeExplore(playerId:Int, gridInt:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE): ResourcePreview;
    function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource;
    function takeResource(playerId:Int, gridInt:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo)->Void):Void;

    function checkValidTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid):Bool;
    function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo)->Void):Void;

    function getStrategyRate(p1People:People, strategy:Strategy):{energyBefore:Int, energyAfter:Int, rate:Float};


    function getTakeStrategyPreview(playerId:Int, gridId:Int, peopleId:Dynamic, strategyId:Dynamic):{};
}