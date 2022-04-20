package model;

import model.IModel.ExplorePreview;
import model.GridGenerator.BUILDING;
import model.IModel.NegoPreview;
import model.IModel.WarPreview;
import model.IModel.ActionInfoID;
import model.IModel.EventInfoID;
import model.IModel.PlayerInfo;
import model.IModel.GameInfo;
import model.GridGenerator.Grid;
import model.PeopleGenerator.People;

class TestExploreModel extends DebugModel {

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
        g.buildtype = BUILDING.EMPTY;
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

    override function getTakeExplorePreview(playerId:Int, gridId:Int):ExplorePreview {
        return {
            explorePeople:[
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ],
            fightPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ],
            energyAfter: [
                10,20,30
            ],
            // successRate: [0.3, .5, 2]
        }
    }

    override function takeExplore(playerId:Int, gridInt:Int, p1SelectId:Int, exploreId:Int, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.EXPLORE_RESULT,
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

    override function getRateOfInvitePeople(people:People, invite:People):Float {
        return 0.05;
    }
}