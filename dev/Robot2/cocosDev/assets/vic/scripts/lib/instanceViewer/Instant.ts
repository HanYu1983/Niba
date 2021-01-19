// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3 } from 'cc';
import { Pool } from '../Pool';
import { IInstant } from './IInstant';
const { ccclass, property } = _decorator;

@ccclass('Instant')
export class Instant extends Component implements IInstant {

    @property(Pool)
    pool:Pool = null;

    @property(Node)
    childs:Instant[] = [];

    outOfWorld:Vec3 = new Vec3(5000,0,0);
    
    clear():void{
        this.node.active = false;
        this.childs.forEach(item=>item.getComponent(Instant)?.clear());
    }
    build(data:any):void{
        this.clear();
        const content = this.checkData(data);
        if(content){
            this.node.active = true;
            this.doBuild(content, data);
            this.childs.forEach(item=>item.getComponent(Instant)?.build(data));
        }
    }
    protected doBuild(content:any, data:any):void{

    }
    protected checkData(data:any):any{
        return data;
    }
}
