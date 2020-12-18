// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { InstMenu } from '../lib/instanceViewer/InstMenu';
const { ccclass, property } = _decorator;

@ccclass('UnitMenu')
export class UnitMenu extends InstMenu {

    protected checkData(data:any):any{
        return data.content["unitMenu"];
    }
}
