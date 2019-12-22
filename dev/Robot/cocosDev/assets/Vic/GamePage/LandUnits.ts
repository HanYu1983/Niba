// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Unit from "./Unit"
import Pool from "../Pool"
import Controller from "../Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Color)
    playerColor: cc.Color = null;

    @property(cc.Color)
    playerEndColor: cc.Color = null;

    @property(cc.Color)
    enemyColor: cc.Color = null;

    @property(cc.Color)
    enemyEndColor: cc.Color = null;

    @property(Unit)
    prefabUnit: Unit = null;

    start() {

        // let units = [];
        // for (let i = 0; i < 10; ++i) {
        //     units.push({
        //         id: i,
        //         name: "V" + i,
        //         isPlayer: Math.random() > .5 ? true : false,
        //         isMovable: Math.random() > .5 ? true : false,
        //         pos: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]
        //     })
        // }
        // this.setUnits(units);

        // this.moveUnitByID(0, [[5, 5], [5, 9], [10, 9]]);
        // this.moveUnitByID(3, [[12, 12], [6, 12], [6, 9], [8, 9], [8, 10], [10, 10]]);
    }

    setUnits(data: any) {
        let units = data.units;
        for (let element of units) {
            let unitId = element["key"];
            let name = element["key"];
            let isPlayer = (element["player"] == "player");
            let isMovable = true;
            let pos = element["position"];

            let unitNode: cc.Node = this.getComponent(Pool).getNode(this.prefabUnit.node);
            unitNode.setParent(this.node);

            let gridPos = Controller.instance.view.getGridPos(pos[0], pos[1]);
            unitNode.x = gridPos[0];
            unitNode.y = gridPos[1];
            unitNode.active = true;

            let unit: Unit = unitNode.getComponent(Unit);
            unit.unitId = unitId;
            unit.setName(name);

            if (isPlayer) {
                if (isMovable) {
                    unit.setColor(this.playerColor);
                } else {
                    unit.setColor(this.playerEndColor);
                }
            } else {
                if (isMovable) {
                    unit.setColor(this.enemyColor);
                } else {
                    unit.setColor(this.enemyEndColor);
                }
            }
        }
    }

    getUnitByID(id: number): Unit {
        let units = this.getComponent(Pool).getNodes();
        for (let element of units) {
            if (element.getComponent(Unit).unitId == id) {
                return element.getComponent(Unit);
            }
        }
        return undefined;
    }

    moveUnitByID(id: number, moveTo: any) {
        let unit = this.getUnitByID(id);
        if (unit) {
            let actions = [];
            moveTo.forEach(element => {
                let gridPos = Controller.instance.view.getGridPos(element[0], element[1]);
                let action = cc.moveTo(.3, gridPos[0], gridPos[1]);
                action.easing(cc.easeSineOut());
                actions.push(action);
            });
            unit.node.runAction(cc.sequence(actions));
        }
    }
}
