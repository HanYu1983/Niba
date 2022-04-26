package model;

import model.IModel.EventInfoID;
import model.IModel.GameInfo;
import model.PeopleGenerator.People;
import model.IModel.PreResultOnWar;
import model.IModel.WarPreview;

class TestOccupationModel extends DebugModel{

    override function getPreResultOfWar(playerId:Int, gridId:Int, p1:People, p2:People, army1:Float, army2:Float):Array<PreResultOnWar> {
        return [
            {
                energyBefore:1,
                energyAfter:1,
                armyBefore:1,
                armyAfter:1,
                moneyBefore:1,
                moneyAfter:1,
                foodBefore:1,
                foodAfter:1,
                maintainFoodBefore:1,
                maintainFoodAfter:1,
            },
            {
                energyBefore:1,
                energyAfter:1,
                armyBefore:1,
                armyAfter:1,
                moneyBefore:1,
                moneyAfter:1,
                foodBefore:1,
                foodAfter:1,
                maintainFoodBefore:1,
                maintainFoodAfter:1,
            }
        ];
    }

    override function takeWarOn(playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, cb:(gameInfo:GameInfo) -> Void) {
        var info = gameInfo();
        info.events = [
            {
                id:EventInfoID.WAR_RESULT,
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

    override function getTakeWarPreview(playerId:Int, gridId:Int):WarPreview {
        return {
            p1:info.players[0],
            p2:info.players[1],
            p1ValidPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ],
            p2ValidPeople: [
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
                PeopleGenerator.getInst().generate(),
            ]
        };
    }
}