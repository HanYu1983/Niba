package model;

import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

typedef PlayerInfo = {
    id:Int,
    name:String,
    money:Int,
    army:Int,
    strategy:Int,
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
    player:PlayerInfo,
    fightPeople:Array<People>,
    armyBefore:Int,
    armyAfter:Array<Int>,
    moneyBefore:Int,
    moneyAfter:Array<Int>
}

typedef NegoPreview = {

}

interface IModel{

    
    function gameStart(cb:Void->Void):Void;
    function gameInfo():GameInfo;
    function getPeople(count:Int):Array<People>;
    function playerDice(cb:Void->Void):Void;
    function playerEnd(cb:()->Void):Void;
    function getTakeWarPreview(playerId:Int, gridId:Int):Array<WarPreview>;
    function takeWarOn(playerId:Int, gridId:Int, cb:(gameInfo:GameInfo)->Void):Void;
    function getTakeNegoPreview(playerId:Int, gridId:Int):Array<NegoPreview>;
    function takeNegoOn(playerId:Int, gridId:Int, cb:(gameInfo:GameInfo)->Void):Void;
    // function currentPlayer():PlayerInfo;
    // function isPlayerTurn():Bool;
    // function getGrids(count:Int):Array<Grid>;
    
}