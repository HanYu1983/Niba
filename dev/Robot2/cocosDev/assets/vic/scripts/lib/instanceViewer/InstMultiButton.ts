// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, Sprite, UITransform } from 'cc';
import { InstButton } from './InstButton';
const { ccclass, property } = _decorator;

@ccclass('InstMultiButton')
export class InstMultiButton extends InstButton {

    @property(Node)
    multiPrefab:Node = null;

    @property(Node)
    icons:Node = null;

    private multis:Node[] = [];

    clear():void{
        super.clear();

        this.multis.forEach(item=>{
            this.pool.release(this.multiPrefab, item);
        });
        this.multis = [];
    }

    build(data:any):void{
        super.build(data);

        this.setMultiCount(data[3]);
        this.setCurrentAt(data[4]);
    }

    private setMultiCount(count:number){

        for(let i = 0; i < count; ++i){
            let multi:Node = this.pool.aquire(this.multiPrefab, this.icons);
            multi.name = 'multi_' + i;
            multi.position.set(i / count * this.icons.getComponent(UITransform).contentSize.width);
            multi.scale.set(1 / count - .01, 1, 1);
            this.multis.push(multi);
        }
    }

    private setCurrentAt(id:number){
        for(let i = 0; i < this.multis.length; ++i){
            let icon = this.multis[i];
            icon.getComponent(Sprite).color = (i == id) ? this.focusColor : this.normalColor;
        }
    }
}
