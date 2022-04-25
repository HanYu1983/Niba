package model;

import model.GridGenerator.BUILDING;
import model.IModel.ActionInfoID;
import model.IModel.MARKET;
import model.IModel.RESOURCE;
import model.IModel.EventInfoID;
import model.PeopleGenerator.People;
import model.IModel.PreResultOnResource;
import model.IModel.GameInfo;
import model.IModel.ResourcePreview;

class TestResourceModel extends DebugModel{

    override function playerDice(cb:() -> Void) {
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
    override function getTakeResourcePreview(playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
        return {
            p1ValidPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ]
        }
    }

    override function getPreResultOfResource(playerId:Int, gridId:Int, p1:People, market:MARKET, type:RESOURCE):PreResultOnResource {
        return {
            energyAfter: 10,
            energyBefore: 10,
            armyBefore:10,
            armyAfter:10,
            moneyBefore:10,
            moneyAfter:10,
            foodBefore:10,
            foodAfter:10,
            maintainFoodBefore:10,
    		maintainFoodAfter:10,
        }
    }

    override function takeResource(playerId:Int, gridInt:Int, p1PeopleId:Int, market:MARKET, type:RESOURCE, cb:(gameInfo:GameInfo) -> Void) {
        info.events = [
            {
                id: EventInfoID.RESOURCE_RESULT,
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
}