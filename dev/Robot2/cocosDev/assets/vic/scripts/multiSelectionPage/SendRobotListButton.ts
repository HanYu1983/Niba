// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { Drawer } from '../Drawer';
import { InstButton } from '../lib/instanceViewer/InstButton';
const { ccclass, property } = _decorator;

@ccclass('SendRobotListButton')
export class SendRobotListButton extends InstButton {
    
    @property(Label)
    lblPilot:Label = null;

    @property(Sprite)
    send:Sprite = null;

    doBuild(content:any, data:any):void{
        const dataString = content[0];
        const title = dataString.split("_")[0];
        const pilot = dataString.split("_")[1];
        const send = dataString.split("_")[2];
        content[0] = title;
        super.doBuild(content, data);
        this.setPilot(pilot);
        this.setSend( send == "true" )
    }

    private setPilot(money:number){
        this.lblPilot.string = money.toString();
    }

    private setSend(send:boolean){
        this.send.node.active = send;
    }
}
