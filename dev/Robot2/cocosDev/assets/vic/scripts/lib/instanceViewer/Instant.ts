// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3, CCBoolean } from 'cc';
import { Pool } from '../Pool';
import { IInstant } from './IInstant';
const { ccclass, property } = _decorator;

@ccclass('Instant')
export class Instant extends Component implements IInstant {

    @property(Pool)
    pool:Pool = null;

    @property(Node)
    childs:Instant[] = [];

    // 打開這個的時候，物件在顯示與否是用active來操作的。會比較消耗效能
    // 預設是不開的，此時只會把要關掉的物件移開到畫面外，要打開時再移進來。不做active的操作
    // 實測在物件數目破百時，效能差距就蠻大的
    @property(CCBoolean)
    doActiveWhenBuildClear:boolean = false;

    outOfWorld:Vec3 = new Vec3(5000,5000,0);
    cachePos:Vec3 = Vec3.ZERO;

    cacheScale:Vec3 = Vec3.ZERO;

    start(){

        // 把在editor裏設定的位置記下來
        this.cachePos = this.node.getPosition();
        this.cacheScale = this.node.getScale();

        // 先一律不能用active的模式，效能才可以接受，之後如果測試都ok，就把這個參數拿掉
        this.doActiveWhenBuildClear = false;
    }
    
    clear():void{

        if(this.doActiveWhenBuildClear){
            this.node.active = false;
        }else{

            // 移開到畫面外，代替 active = false 的操作
            // 同時把縮放及位置都設定，確保一定消失于場景上
            this.node.setPosition(this.outOfWorld);
            this.node.setScale(Vec3.ZERO);
        }
        this.childs.forEach(item=>item.getComponent(Instant)?.clear());
    }
    build(data:any):void{
        this.clear();
        const content = this.checkData(data);
        if(content){

            if(this.doActiveWhenBuildClear){
                this.node.active = true;
            }else{
                if(!this.node.active) this.node.active = true;

                // 回到editor裏設定的位置
                // 同時把縮放及位置都設定
                this.node.setPosition(this.cachePos);
                this.node.setScale(new Vec3(1,1,1));
            }
            
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
