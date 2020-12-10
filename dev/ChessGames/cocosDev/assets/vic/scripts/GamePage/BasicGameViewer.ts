// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { IGame } from './IGame';
const { ccclass, property } = _decorator;

@ccclass('BasicGameViewer')
export class BasicGameViewer extends Component implements IGame {
    btnBackStep:Button = null;
    lblStatus:Label = null;

    protected sendData:Array<any> = [];

    onGameStart(arg?:any):void{

    }
    onGameEnd(arg?:any):void{

    }
    onUpdate(arg?:any):void{

    }

    protected removeBtnBackStepListener(){
        this.btnBackStep.node.off("click");
    }

    protected addBtnBackStepListener(func:(btn)=>void){
        this.removeBtnBackStepListener();
        this.btnBackStep.node.on("click", func, this);
    }
    protected setStatus(status:string){
        this.lblStatus.string = status;
    }
}
