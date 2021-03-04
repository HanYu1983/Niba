
import { _decorator, Component, Node, Label } from 'cc';
import { InstButton } from '../lib/instanceViewer/InstButton';
const { ccclass, property } = _decorator;

@ccclass('AssocCRMyRobotListButton')
export class AssocCRMyRobotListButton extends InstButton {
    @property(Label)
    lblPower:Label = null;

    doBuild(content:any, data:any):void{
        const dataString = content[0];
        const datas = dataString.split("_");
        const title = datas[0];
        
        content[0] = title;
        super.doBuild(content, data);
        
        const power = datas[1];
        const maxPower = datas[2];
        const maxHP = datas[3];
        const maxEN = datas[4];
        const armor = datas[5];
        const beamArmor = datas[6];
        this.lblPower.string = "[HP] " + maxHP + " [EN] " + maxEN + " [AR] " + armor + " [BAR] " + beamArmor + " [P] " + power + " / " + maxPower;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
