package model;

import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class DebugModel implements IModel {

    public function new() {}

	public function getGrids(count:Int):Array<Grid> {
		return GridGenerator.getInst().getGrids(count);
	}

	public function getPeople(count:Int):Array<People> {
        var people = [];
        for(i in 0...count){
            people.push(PeopleGenerator.getInst().generate());
        }
		return people;
	}

	public function gameStart(cb:Void->Void):Void {
		cb();
	}

	public function currentPlayer():PlayerInfo {
		return {
            id:0,
            name:'han',
            money:1000,
            people:[],
            atGridId:0
        };
	}

	public function isPlayerTurn():Bool {
		return (Math.random() > .5);
	}

	public function gameInfo():GameInfo {
		return {
            players:[
                {
                    id:0,
                    name:'vic',
                    money:1000,
                    people:[],
                    atGridId:0
                },
                {
                    id:0,
                    name:'han',
                    money:1000,
                    people:[],
                    atGridId:3
                },
                {
                    id:0,
                    name:'xiao',
                    money:1000,
                    people:[],
                    atGridId:2
                }
            ],
            grids:getGrids(100),
            isPlayerTurn:isPlayerTurn(),
            currentPlayer:currentPlayer(),
            isPlaying: true,
            currentActionName:[]
        };
	}

	public function playerDice(cb:() -> Void) {
        cb();
    }
}