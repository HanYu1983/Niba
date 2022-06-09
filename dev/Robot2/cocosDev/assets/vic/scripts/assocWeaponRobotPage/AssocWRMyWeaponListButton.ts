// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
import { Drawer } from '../Drawer';
import { InstButton } from '../lib/instanceViewer/InstButton';
const { ccclass, property } = _decorator;

@ccclass('AssocWRMyWeaponListButton')
export class AssocWRMyWeaponListButton extends InstButton {
    
    @property(Label)
    lblRobot:Label = null;

    doBuild(content:any, data:any):void{
        const dataString = content[0];
        const title = dataString.split("_")[0];
        const robot = dataString.split("_")[1];
        content[0] = title;
        super.doBuild(content, data);
        this.setRobot(robot);
    }

    private setRobot(robot:string){
        this.lblRobot.string = robot;
    }
}
