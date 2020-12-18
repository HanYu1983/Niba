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

@ccclass('LobbyPage')
export class LobbyPage extends GameInst {
    
    @property(Instant)
    menu:Instant = null;

    clear():void{
        super.clear();
        this.menu.clear();
    }

    protected checkData(data:any):any{
        if (data.LobbyPage.Active){
            return data.LobbyPage;
        }
        return null;
    }

    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);

        let menuData = this.getMenu(data, content.Menus[0]);
        this.menu.build(menuData);
    }
}
