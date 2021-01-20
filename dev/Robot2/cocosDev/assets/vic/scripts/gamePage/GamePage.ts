// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween, Sprite, Vec3 } from 'cc';
import { BasicPage } from '../BasicPage';
import { LandMap } from './LandMap';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicPage {

    @property(LandMap)
    map:LandMap = null;

    clear(){
        super.clear();
        this.map.clear();
    }
   
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        
        const gameData = content.GameplayPages;
        this.map.build(gameData);
    }

}
