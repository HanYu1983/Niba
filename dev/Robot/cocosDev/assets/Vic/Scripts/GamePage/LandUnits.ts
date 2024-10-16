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
import ViewController from "../ViewController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LandUnits extends cc.Component {

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

    private _units: Array<cc.Node> = [];
    private _pool: Pool;

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

    onLoad() {
        this._pool = this.node.getComponent(Pool);
    }

    setUnits(units: any) {
        this.clearUnits();
        for (const element of units) {
            const unitId = element.key;
            const pos = element.position;
            let unitNode: cc.Node = this._pool.acquire();
            unitNode.setParent(this.node);

            let gridPos = ViewController.instance.view.getGridPos(pos);
            unitNode.x = gridPos[0];
            unitNode.y = gridPos[1];
            unitNode.active = true;
            
            let unit: Unit = unitNode.getComponent(Unit);
            unit.unitId = unitId;

            if (element.itemState != undefined){
                let itemKey = element.key;

                // 暫時的，目前key還不確定
                if( itemKey == "_item_13" ){
                    itemKey = "land_box";
                }
                unit.setUnitImage(itemKey);
                unit.setColor(cc.Color.WHITE);
            }else{
                const unitName = element.robotState.robotKey;
                const isPlayer = (element.playerKey == "player");
                const isDone = element.robotState.tags.done != undefined;
                const isSky = element.robotState.tags.sky != undefined;
                
                if (isSky) unit.unit.y += 6;

                unit.setUnitImage(unitName);

                if (isPlayer) {
                    if (isDone) {
                        unit.setColor(this.playerEndColor);
                    } else {
                        unit.setColor(this.playerColor);
                    }
                } else {
                    if (isDone) {
                        unit.setColor(this.enemyEndColor);
                    } else {
                        unit.setColor(this.enemyColor);
                    }
                }

                this._units.push(unitNode);
            }
            
        }
    }

    shakeOneUnit(id: string) {
        let unit: Unit = this.getUnitByID(id);
        if (unit) {
            unit.shake();
        }
    }

    evadeOneUnit(id: string) {
        let unit: Unit = this.getUnitByID(id);
        if (unit) {
            unit.evade();
        }
    }

    toSkyUnit(id: string, cb: () => void) {
        let unit: Unit = this.getUnitByID(id);
        if (unit) {
            unit.toSky(cb);
        }
    }

    toLandUnit(id: string, cb: () => void) {
        let unit: Unit = this.getUnitByID(id);
        if (unit) {
            unit.toLand(cb);
        }
    }

    clearUnits() {
        this._units.forEach(unit => {
            this._removeUnit(unit);
        });
        this._units = [];
    }

    removeUnitByID(id: string) {
        let unit = this.getUnitByID(id);
        if (unit) {
            this._units.splice(this._units.indexOf(unit.node), 1);
            this._removeUnit(unit.node);
        }
    }

    setUnitPos(id: string, pos: number[]) {
        let unit = this.getUnitByID(id);
        if (unit) {
            let unitPos = ViewController.instance.view.getGridPos(pos);
            unit.node.x = unitPos[0];
            unit.node.y = unitPos[1];
        }
    }

    getUnitByID(id: string): Unit {
        for (let element of this._units) {
            if (element.getComponent(Unit).unitId == id) {
                return element.getComponent(Unit);
            }
        }
        return undefined;
    }

    moveUnitByID(id: string, moveTo: any, callback: () => void) {
        let unit = this.getUnitByID(id);
        if (unit) {
            let actions = [];
            moveTo.forEach(element => {
                let gridPos = ViewController.instance.view.getGridPos(element);
                let action = cc.moveTo(.05, gridPos[0], gridPos[1]);
                //action.easing(cc.easeSineOut());
                actions.push(action);
            });
            actions.push(cc.callFunc(callback));
            unit.node.runAction(cc.sequence(actions));
        }
    }

    _removeUnit(unitNode: cc.Node) {
        unitNode.removeFromParent();
        unitNode.getComponent(Unit).unitId = "";
        unitNode.getComponent(Unit).unit.y = 0;
        this._pool.release(unitNode);
    }
}
