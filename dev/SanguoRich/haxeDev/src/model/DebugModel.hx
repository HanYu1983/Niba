package model;

import model.IModel.NegoPreview;
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

    function gp(id, name) {
        return {
            {
                id:id,
                name:name,
                money:1000.0,
                army: 100.0,
                food: 100.0,
                strategy: 10.0,
                people:[
                    PeopleGenerator.getInst().generate(),
                    PeopleGenerator.getInst().generate()
                ],
                atGridId:0
            }
        }
    }

	public function gameStart(cb:Void->Void):Void {
        info = {
            players:[
                gp(0, 'vic'),
                gp(0, 'han'),
                gp(0, 'xiao'),
                gp(0, 'any')
            ],
            grids:getGrids(100),
            isPlayerTurn:true,
            currentPlayer:gp(0, 'vic'),
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

	public function getTakeWarPreview(playerId:Int, gridId:Int):Array<WarPreview> {
		return [
            {
                player: info.players[0],
                fightPeople: [
                    PeopleGenerator.getInst().generate(),
                    PeopleGenerator.getInst().generate()
                ],
                armyBefore: 100,
                armyAfter: [30, 5],
                moneyBefore: 1000,
                moneyAfter: [500, 400]
            },{
                player: info.players[1],
                fightPeople: [
                    PeopleGenerator.getInst().generate(),
                    PeopleGenerator.getInst().generate()
                ],
                armyBefore: 200,
                armyAfter: [320, 52],
                moneyBefore: 1300,
                moneyAfter: [320, 533]
            }
        ];
	}

	public function takeWarOn(playerId:Int, gridId:Int, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.NEGOTIATE_RESULT,
                value:null
            }
        ];
        cb(info);
    }

	public function getTakeNegoPreview(playerId:Int, gridId:Int):Array<NegoPreview> {
		return [];
	}

	public function takeNegoOn(playerId:Int, gridId:Int, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.NEGOTIATE_RESULT,
                value:null
            }
        ];
        cb(info);
    }
}