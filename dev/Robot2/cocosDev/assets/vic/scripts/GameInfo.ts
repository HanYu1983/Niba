// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('GameInfo')
export class GameInfo extends Instant {

    @property(Label)
    lblMoney:Label = null;

    protected checkData(data:any):any{
        if(data.GameInfo) return data.GameInfo;
        return null;
    }

    protected doBuild(content:any, data:any):void{
        this.lblMoney.string = content.Money;
    }
}
