package model;

import model.IModel.PreResultOnNego;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class TestNegoModel extends DebugModel {

	override public function playerDice(cb:() -> Void) {
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


	override public function getTakeNegoPreview(playerId:Int, gridId:Int):NegoPreview {
		return {
            p1ValidPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ],
            p2ValidPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ],
        };
	}

	override public function takeNegoOn(playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int, cb:(gameInfo:GameInfo) -> Void) {
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

    override function getPreResultOfNego(people:People, invite:People):PreResultOnNego {
        return {
            energyAfter:1,
            armyBefore:2,
            armyAfter:3,
            moneyBefore:4,
            moneyAfter:5,
            foodBefore:6,
            foodAfter:7,
            successRate:.8
        };
    }
}