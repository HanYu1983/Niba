// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends BasicViewer {

    open(arg?:any):void{
        super.open(arg);
    }

}
