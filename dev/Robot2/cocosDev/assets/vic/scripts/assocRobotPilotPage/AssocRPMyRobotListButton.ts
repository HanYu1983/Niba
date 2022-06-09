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

@ccclass('AssocRPMyRobotListButton')
export class AssocRPMyRobotListButton extends InstButton {
    
    @property(Label)
    lblPilot:Label = null;

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
        const pilot = datas[7];
        this.lblPilot.string = "[耐久] " + maxHP + " [能量] " + maxEN + " [裝甲] " + armor + " [抗光束] " + beamArmor + " [出力] " + power + " / " + maxPower + " [駕駛] " + pilot;

    }
}
