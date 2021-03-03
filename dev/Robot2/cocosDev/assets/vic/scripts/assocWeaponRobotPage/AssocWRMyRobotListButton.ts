
import { _decorator, Component, Node, Label } from 'cc';
import { InstButton } from '../lib/instanceViewer/InstButton';
const { ccclass, property } = _decorator;

@ccclass('AssocWRMyRobotListButton')
export class AssocWRMyRobotListButton extends InstButton {
    @property(Label)
    lblPower:Label = null;

    doBuild(content:any, data:any):void{
        const dataString = content[0];
        const title = dataString.split("_")[0];
        const power = dataString.split("_")[1];
        const maxPower = dataString.split("_")[2];
        content[0] = title;
        super.doBuild(content, data);
        this.setPower(power, maxPower);
    }

    private setPower(power:number, maxPower:number){
        this.lblPower.string = power + "/" + maxPower;
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
