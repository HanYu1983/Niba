// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
import { Pool2 } from './lib/Pool2';
const { ccclass, property } = _decorator;

@ccclass('GameInst')
export class GameInst extends Instant {

    @property(Pool2)
    menuPool:Pool2 = null;

    private menus:Node[] = [];

    clear():void{
        super.clear();

        this.menus.forEach(menu=>{
            this.menuPool.release(menu);
        });
    }
    
    protected getMenu(data:any, key:string):any{
        if(data.Menu1Ds[key]){
            const menu = data.Menu1Ds[key];
            return [
                menu.Options, Array.from(menu.Options, x => 0), menu.Cursor
            ]
        }
        return null;
        // if(data.Menu1Ds[key]) return [0,data.Menu1Ds[key]];
        // if(data.Menu2Ds[key]) return [1,data.Menu2Ds[key]];
        // return null;
    }

    protected doBuild(data:any, all:any):void{
        super.doBuild(data, all);

        for(let i = 0; i < data.Menus.length; ++i){
            const menuData = this.getMenu(all, data.Menus[i]);
            console.log(menuData);
            
            let menu = this.menuPool.aquire(this.node);
            menu.getComponent(Instant)?.build(menuData);

            this.menus.push(menu);
        }
    }
}
