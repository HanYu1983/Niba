// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, tween, View, UITransform, CCInteger, Enum } from 'cc';
import { Instant } from './Instant';
import { InstButton } from './InstButton';
import { InstMultiButton } from './InstMultiButton';
const { ccclass, property } = _decorator;

export enum Type{
    Horizontal,
    Vertical
} 

export enum Align{
    Start,
    Center,
    End
}

@ccclass('InstMenu')
export class InstMenu extends Instant {

    @property(Node)
    prefab:Node = null;   
    
    @property(Node)
    multiPrefab:Node = null;

    @property(CCInteger)
    buttonSize:number = 30;

    @property({type:Enum(Type)})
    type:Type = Type.Vertical;

    @property({type:Enum(Align)})
    align:Align = Align.Center;

    private tempMultiMutton:Node[] = [];
    private tempButton:Node[] = [];
    
    start(){
        
        super.start();
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

    doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        this.setButtons(content[0], content[1], content[2]);
    }

    private setButtons(btns:any[], multiId:number[], focus:number){
        
        const combine = btns.map((e, i)=>{
            return [e, multiId[i]];
        });

        const gap:number = this.buttonSize + 1;
        const borderSize:number = combine.length * gap;
        combine.forEach(([item, multiId], i)=>{
            const isArray = Array.isArray(item) && item.length > 1;
            const btn:Node = isArray ? this.pool.aquire(this.multiPrefab, this.node) : this.pool.aquire(this.prefab, this.node);
            
            const label = isArray ? item[multiId] : item;
            const isFocus = (focus == i) ? true : false;
            
            if(isArray){
                btn.getComponent(InstMultiButton).build([label, isFocus, 1, item.length, multiId]);
                this.tempMultiMutton.push(btn);
            }else{
                btn.getComponent(InstButton).build([label, isFocus, 1]);
                this.tempButton.push(btn);
            }
            
            let offset = 0;
            switch(this.align){
                case Align.Start: break;
                case Align.Center: offset = borderSize / 2;
                case Align.End: break;
            }
            if(this.type == Type.Horizontal){
                
                btn.getComponent(UITransform)?.contentSize.set(this.buttonSize, btn.getComponent(UITransform)?.contentSize.height);
                btn.position.set(i * gap - offset + this.buttonSize / 2, btn.position.y, btn.position.z);
            }else{
                btn.getComponent(UITransform)?.contentSize.set(btn.getComponent(UITransform)?.contentSize.width, this.buttonSize);
                btn.position.set(btn.position.x, i * -gap + offset - this.buttonSize / 2, btn.position.z);
            }
        });
    }

}
