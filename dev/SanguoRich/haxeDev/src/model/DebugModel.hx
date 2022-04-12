package model;

import model.IModel.WarPreview;
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
                    army: 100,
                    strategy: 10,
                    people:[
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate()
                    ],
                    atGridId:0
                },
                {
                    id:1,
                    name:'han',
                    money:10001,
                    army: 1001,
                    strategy: 101,
                    people:[
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate()
                    ],
                    atGridId:3
                },
                {
                    id:2,
                    name:'xiao',
                    money:10002,
                    army: 1002,
                    strategy: 102,
                    people:[
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate()
                    ],
                    atGridId:2
                },
                {
                    id:3,
                    name:'yu',
                    money:10003,
                    army: 1003,
                    strategy: 103,
                    people:[
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate(),
                        PeopleGenerator.getInst().generate()
                    ],
                    atGridId:2
                }
            ],
            grids:getGrids(100),
            isPlayerTurn:true,
            currentPlayer:{
                id:0,
                name:'vic',
                money:1000,
                army: 1003,
                strategy: 103,
                people:[],
                atGridId:0
            },
            isPlaying: true,
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
        info.actions = [
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


        var g = GridGenerator.getInst().getGrid();
        g.belongPlayerId = 1;
        
        info.events = [
            {
                id:EventInfoID.WALK_STOP,
                value:{
                    grid:g,
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
        info.events = [];
        cb();
    }

	public function getTakeWarPreview(playerId:Int, grid:Grid):Array<WarPreview> {
		return [
            {
                player: info.players[0],
                armyBefore: 100,
                armyAfter: 30,
                moneyBefore: 1000,
                moneyAfter: 500
            },{
                player: info.players[1],
                armyBefore: 200,
                armyAfter: 20,
                moneyBefore: 1300,
                moneyAfter: 540
            }
        ];
	}
}