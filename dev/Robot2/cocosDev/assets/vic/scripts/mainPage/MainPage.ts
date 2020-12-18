// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { GameInst } from '../GameInst';
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends GameInst {

    protected checkData(data:any):any{
        if (data.StartPage.Active){
            return data.StartPage;
        }
        return null;
    }

    protected doBuild(data:any, all:any):void{
        super.doBuild(data, all);
        // console.log("start page");
        
        
        // console.log(data);

        // this.getMenu()
    }
}
