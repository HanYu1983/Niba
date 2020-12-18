// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { GameInst } from '../GameInst';
import { Instant } from '../lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends GameInst {

    // @property(Instant)
    // startMenu:Instant = null;

    // clear():void{
    //     this.startMenu.clear();
    // }

    protected checkData(data:any):any{
        if (data.StartPage.Active){
            return data.StartPage;
        }
        return null;
    }

    protected doBuild(data:any, all:any):void{
        super.doBuild(data, all);
        // console.log("start page");

        // let menuData = this.getMenu(all, data.Menus[0]);
        // this.startMenu.build(menuData);

        // console.log(data);

        // this.getMenu()
    }
}
