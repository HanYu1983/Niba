package model;

import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class DebugModel implements IModel {

    public function new() {}

    private var info:GameInfo;

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
        info = {
            players:[
                {
                    id:0,
                    name:'vic',
                    money:1000,
                    people:[],
                    atGridId:0
                },
                {
                    id:1,
                    name:'han',
                    money:1000,
                    people:[],
                    atGridId:3
                },
                {
                    id:2,
                    name:'xiao',
                    money:1000,
                    people:[],
                    atGridId:2
                },
                {
                    id:3,
                    name:'yu',
                    money:1000,
                    people:[],
                    atGridId:2
                }
            ],
            grids:getGrids(100),
            isPlayerTurn:true,
            currentPlayer:{
                id:0,
                name:'vic',
                money:1000,
                people:[],
                atGridId:0
            },
            isPlaying: true,
            beforeActions: [],
            actions:[],
            events: []
        };
		cb();
	}

	public function currentPlayer():PlayerInfo {
		return info.currentPlayer;
	}

	public function isPlayerTurn():Bool {
        return info.isPlayerTurn;
	}

	public function gameInfo():GameInfo {
		return info;
	}

	public function playerDice(cb:() -> Void) {
        info.players[0].atGridId += Math.floor(Math.random() * 6);
        info.currentPlayer = info.players[Math.floor(Math.random() * 4)];
        info.isPlayerTurn = (info.currentPlayer.id == 0);
        info.beforeActions = [
            {
                id:ActionInfoID.MOVE,
                value:{
                    playerId:0,
                    fromGridId:5,
                    toGridId:10
                },
                gameInfo: gameInfo()
            }
        ];
        info.actions = [{
            id:ActionInfoID.MOVE,
            value:{
                playerId:1,
                fromGridId:8,
                toGridId:13
            },
            gameInfo:gameInfo()
        },{
            id:ActionInfoID.MOVE,
            value:{
                playerId:2,
                fromGridId:10,
                toGridId:15
            },
            gameInfo:gameInfo()
        }];
        info.events = [
            {
                id:EventInfoID.WORLD_EVENT,
                value:{
                    commands:[]
                }
            }
        ];
        cb();
    }

	public function playerEnd(cb:() -> Void) {
        info.players[0].atGridId += Math.floor(Math.random() * 6);
        info.currentPlayer = info.players[Math.floor(Math.random() * 4)];
        info.isPlayerTurn = (info.currentPlayer.id == 0);
        info.actions = [];
        info.beforeActions = [{
            id:ActionInfoID.MOVE,
            value:{
                playerId:1,
                fromGridId:8,
                toGridId:13
            },
            gameInfo:gameInfo()
        },{
            id:ActionInfoID.MOVE,
            value:{
                playerId:2,
                fromGridId:10,
                toGridId:15
            },
            gameInfo:gameInfo()
        }];
        info.events = [];
        cb();
    }
}