package model;

import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

typedef PlayerInfo = {
    id:Int,
    name:String,
    money:Int,
    people:Array<People>,
    atGridId:Int
}

typedef ActionInfo = {
    id:Int,
    value:Dynamic
}

typedef GameInfo = {
    players:Array<PlayerInfo>,
    grids:Array<Grid>,
    isPlayerTurn:Bool,
    currentPlayer:PlayerInfo,
    isPlaying:Bool,
    currentActionName:Array<ActionInfo>,
}

interface IModel{

    
    public function gameStart(cb:Void->Void):Void;
    public function currentPlayer():PlayerInfo;
    public function isPlayerTurn():Bool;
    public function gameInfo():GameInfo;

    private function getGrids(count:Int):Array<Grid>;
    public function getPeople(count:Int):Array<People>;

    public function playerDice(cb:Void->Void):Void;
}