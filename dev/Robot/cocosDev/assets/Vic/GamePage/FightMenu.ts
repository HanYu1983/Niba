// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightInfo from "./FightInfo";
import Pool from "../Pool";

import Controller from "../Controller";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(Pool)
export default class NewClass extends cc.Component {

    @property(FightInfo)
    fightInfoPrefab: FightInfo = null;

    private _fightInfo: Array<cc.Node> = [];

    showInfos(datas: any[]) {
        this.clearInfo();
        datas.forEach(data => {
            this.showInfo(data);
        });
    }

    showInfo(data: any) {
        let pool: Pool = this.node.getComponent(Pool);
        let fightInfoNode: cc.Node = pool.acquire(this.fightInfoPrefab.node);
        fightInfoNode.active = true;
        fightInfoNode.setParent(this.node);

        let pos = [4, 5];
        let infoPos = Controller.instance.view.getGridPos(pos);
        fightInfoNode.x = infoPos[0];
        fightInfoNode.y = infoPos[1];

        this._fightInfo.push(fightInfoNode);
    }

    clearInfo() {
        let pool: Pool = this.node.getComponent(Pool);
        this._fightInfo.forEach(node=>{
            node.removeFromParent();
            pool.release(node);
        });
        this._fightInfo = [];
    }
}
