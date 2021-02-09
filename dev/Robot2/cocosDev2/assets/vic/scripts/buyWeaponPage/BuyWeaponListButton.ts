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

@ccclass('BuyWeaponListButton')
export class BuyWeaponListButton extends InstButton {
    
    @property(Label)
    lblMoney:Label = null;

    doBuild(content:any, data:any):void{
        const dataString = content[0];
        const title = dataString.split("_")[0];
        const money = dataString.split("_")[1];
        content[0] = title;
        super.doBuild(content, data);
        this.setMoney(money);
    }

    private setMoney(money:number){
        this.lblMoney.string = money.toString();
    }
}
