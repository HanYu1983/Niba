// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import EffectLayer from "./EffectLayer";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(EffectLayer)
    bladeLayer:EffectLayer = null;

    @property(EffectLayer)
    explodeLayer:EffectLayer = null;

    @property(EffectLayer)
    hitHpLayer:EffectLayer = null;

    createBlade(hp:number, pos:number[]){
        this._createBlade(pos);
        this._createHitHp(hp, pos);
    }

    createExplode(hp:number, pos:number[]){
        this._createExplode(pos);
        this._createHitHp(hp, pos);
    }

    private _createBlade(pos:number[]){
        this.bladeLayer.createEffect(pos);
    }

    private _createExplode(pos:number[]){
        this.explodeLayer.createEffect(pos);
    }

    private _createHitHp(hp:number, pos:number[]){
        let effect:cc.Node = this.hitHpLayer.createEffect(pos);
        effect.getChildByName("Hp").getComponent(cc.Label).string = hp.toString();
    }
}
