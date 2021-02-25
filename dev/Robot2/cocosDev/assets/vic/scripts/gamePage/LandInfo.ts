// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
import { ImageChanger } from '../lib/ImageChanger';
import { Instant } from '../lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('LandInfo')
export class LandInfo extends Instant {
    
    @property(Label)
    title:Label = null;

    @property(Label)
    move:Label = null;

    @property(Label)
    accuracy:Label = null;

    @property(Label)
    damage:Label = null;

    clear(){
        super.clear();
    }

    doBuild(content:any, data:any){
        this.setLand(content);
    }

    private setLand(land:any){
        this.title.string = land.Title;
        this.move.string = land.Cost;
        this.accuracy.string = land.HitRate;
        this.damage.string = land.Damage;
        this.node.getComponent(ImageChanger)?.changeImage(0, land.ID);
    }
}
