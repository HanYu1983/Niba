// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, tween, View, UITransform, CCInteger } from 'cc';
import { Pool } from '../Pool';
import { Instant } from './Instant';
import { InstButton } from './InstButton';
import { InstMultiButton } from './InstMultiButton';
const { ccclass, property } = _decorator;

@ccclass('InstMenu')
export class InstMenu extends Instant {

    @property(Node)
    prefab:Node = null;   
    
    @property(Node)
    multiPrefab:Node = null;

    @property(CCInteger)
    buttonHeight:number = 30;

    private tempMultiMutton:Node[] = [];
    private tempButton:Node[] = [];
    
    start(){
        
        // example code
        //
        // tween(this.node).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 0]);
        // }).delay(2).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 1]);
        // }).delay(.5).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 1]);
        // }).delay(.5).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 2]);
        // }).delay(.5).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 1, 0], 2]);
        // }).delay(.5).call(()=>{
        //     this.build([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 2, 0], 2]);
        // }).start();
    }

    clear():void{
        super.clear();

        this.tempMultiMutton.forEach(item=>{
            this.pool.release(this.multiPrefab, item);
        })
        this.tempMultiMutton = [];

        this.tempButton.forEach(item=>{
            this.pool.release(this.prefab, item);
        })
        this.tempButton = [];
    }

    doBuild(data:any, all:any):void{
        this.setButtons(data[0], data[1], data[2]);
    }

    private setButtons(btns:any[], multiId:number[], focus:number){
        
        let combine = btns.map((e, i)=>{
            return [e, multiId[i]];
        });
        combine.forEach(([item, multiId], i)=>{
            const isArray = Array.isArray(item);
            let btn:Node = isArray ? this.pool.aquire(this.multiPrefab, this.node) : this.pool.aquire(this.prefab, this.node);
            btn.getComponent(UITransform)?.contentSize.set(btn.getComponent(UITransform)?.contentSize.width, this.buttonHeight);
            btn.position.set(btn.position.x, i * -(this.buttonHeight + 1), btn.position.z);
            const label = isArray ? item[multiId] : item;
            const isFocus = (focus == i) ? true : false;
            
            if(isArray){
                btn.getComponent(InstMultiButton).build([label, isFocus, 1, item.length, multiId]);
                this.tempMultiMutton.push(btn);
            }else{
                btn.getComponent(InstButton).build([label, isFocus, 1]);
                this.tempButton.push(btn);
            }
        });
    }

}
