// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween } from 'cc';
import { BasicPage } from '../BasicPage';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicPage {
   
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        console.log(content);
    }
}
