package model;

import model.IModel.PreResultOnFire;
import model.IModel.MARKET;
import model.IModel.RESOURCE;
import model.IModel.ResourcePreview;
import model.IModel.PreResultOnResource;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnExplore;
import model.IModel.PreResultOnWar;
import model.IModel.PreResultOnHire;
import model.IModel.PreResultOnNego;
import model.IModel.HirePreview;
import model.GridGenerator.BUILDING;
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
                money: 1000.0,
                army: 100.0,
                food: 100.0,
                strategy: 10.0,
                people:[
                    PeopleGenerator.getInst().generate(),
                    PeopleGenerator.getInst().generate()
                ],
                grids:[],
                maintainPeople:-1.2,
                maintainArmy:-1.1,
                atGridId:0
            }
        }
    }

	public function gameStart(cb:Void->Void):Void {
        info = {
            players:[
                gp(0, 'vic'),
                gp(1, 'han'),
                gp(2, 'xiao'),
                gp(3, 'any')
            ],
            grids:getGrids(100),
            isPlayerTurn:true,
            currentPlayer:gp(0, 'vic'),
            isPlaying: true,
            actions:[],
            events: []
        };
        info.grids[5].belongPlayerId = 2;
        info.grids[9].belongPlayerId = 1;
        info.grids[11].belongPlayerId = 3;
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
        g.belongPlayerId = null;
        g.buildtype = BUILDING.MARKET;
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

	public function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
		return null;
	}

	public function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.NEGOTIATE_RESULT,
                value:null
            }
        ];
        cb(info);
    }

	public function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
        return null;
	}

	public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.NEGOTIATE_RESULT,
                value:{
                    success:true,
                    people:PeopleGenerator.getInst().generate(),
                    energyBefore: 100,
                    energyAfter:50,
                    armyBefore: 200,
                    armyAfter: 300,
                    moneyBefore: 200,
                    moneyAfter: 300,
                    foodBefore: 100,
                    foodAfter: 200
                }
            }
        ];
        cb(info);
    }

	public function getTakeHirePreview(playerId:Int, gridId:Int):HirePreview {
		return null;
	}

	public function takeHire(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {}

	public function getRateOfInvitePeople(people:People, invite:People):Float {
		return .5;
	}

	public function getPreResultOfNego(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnNego {
		return null;
	}

	public function getPreResultOfHire(playerId:Int, gridId:Int, people:People, invite:People):PreResultOnHire {
		return null;
	}

	public function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar> {
		return null;
	}

	public function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
		return null;
	}

	public function getPreResultOfExplore(playerId:Int, gridId:Int, p1:People):PreResultOnExplore {
		return null;
	}

	public function takeExplore(playerId:Int, gridInt:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {}

	public function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
		return null;
	}

	public function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource {
		return null;
	}

	public function takeResource(playerId:Int, gridInt:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {}


	public function getPreResultOfFire(playerId:Int, p1PeopleId:Int):PreResultOnFire {
		return {
            maintainMoneyAfter: 10,
            maintainMoneyBefore: 10,
        }
	}

	public function takeFire(playerId:Int, p1PeopleId:Int, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.FIRE_RESULT,
                value:{
                    success:true,
                    people:PeopleGenerator.getInst().generate(),
                    maintainMoneyAfter: 10,
                    maintainMoneyBefore: 10,
                }
            }
        ];
        cb(info);
    }

	public function checkValidTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid):Bool {
		return true;
	}

	public function takeTransfer(playerId:Int, gridInt:Int, playerInfo:PlayerInfo, gridInfo:Grid, cb:(gameInfo:GameInfo) -> Void) {
        
    }
}