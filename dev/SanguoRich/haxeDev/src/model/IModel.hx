package model;

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
    atGridId:Int
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
    WAR_RESULT;
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
    energyAfter:Int,
    armyBefore:Int,
    armyAfter:Int,
    moneyBefore:Int,
    moneyAfter:Int,
    foodBefore:Int,
    foodAfter:Int,
    successRate:Float
} 

typedef PreResultOnWar = {
    energyAfter:Int,
    armyBefore:Int,
    armyAfter:Int,
    moneyBefore:Int,
    moneyAfter:Int,
    foodBefore:Int,
    foodAfter:Int,
} 

typedef PreResultOnHire = {
    energyAfter:Int,
    successRate:Float
}

interface IModel{
    function gameStart(cb:Void->Void):Void;
    function gameInfo():GameInfo;
    function getPeople(count:Int):Array<People>;
    function playerDice(cb:Void->Void):Void;
    function playerEnd(cb:()->Void):Void;
    

    function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview;
    function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar>;
    function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo)->Void):Void;
    
    function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview;
    function getPreResultOfNego(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnNego;
    function takeNegoOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;

    function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview;
    function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People, p2:People):PreResultOnHire;
    function takeHire(playerId:Int, gridInt:Int, p1PeopleId:Int, p2PeopleId:Int, cb:(gameInfo:GameInfo)->Void):Void;
    
    
}