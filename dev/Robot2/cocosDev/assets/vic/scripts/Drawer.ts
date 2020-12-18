// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Instant } from './lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('Drawer')
export class Drawer extends Instant {

    @property(Node)
    mainPagePrefab:Node = null;

    @property(Node)
    gamePagePrefab:Node = null;

    private currentPage:Node = null;
    
    clear():void{
        super.clear();
    }
    doBuild(data:any):void{

        switch(data.page){
            case 0:
                this.currentPage = this.pool.aquire(this.mainPagePrefab, this.node);
                break;
            case 1:
                this.currentPage = this.pool.aquire(this.gamePagePrefab, this.node);
                break;
        }
        this.currentPage.getComponent(Instant)?.build(data);
    }
}
