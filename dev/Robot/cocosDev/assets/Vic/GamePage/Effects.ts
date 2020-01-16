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
import ViewController from "../ViewController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Effects extends cc.Component {

    @property(EffectLayer)
    bladeLayer: EffectLayer = null;

    @property(EffectLayer)
    explodeLayer: EffectLayer = null;

    @property(EffectLayer)
    hitHpLayer: EffectLayer = null;

    @property(EffectLayer)
    aimEffects: EffectLayer = null;

    @property(cc.Node)
    tracker: cc.Node = null;

    onLoad(){
        this.tracker['toGridPos'] = [0,0];
        this.tracker['time'] = 0;
    }

    createBlade(hp: number, pos: number[]) {
        this._createBlade(pos);
        this._createHitHp(hp, pos);
    }

    createExplode(hp: number, pos: number[]) {
        this._createExplode(pos);
        this._createHitHp(hp, pos);
    }

    createAimEffect(from: number[], to: number[]) {
        let fromGridPos = ViewController.instance.view.getGridPos(from);
        this.tracker.x = fromGridPos[0];
        this.tracker.y = fromGridPos[1];
        this.tracker['toGridPos'] = ViewController.instance.view.getGridPos(to);
        this.tracker['time'] = 0;
    }

    private _createBlade(pos: number[]) {
        this.bladeLayer.createEffect(pos);
    }

    private _createExplode(pos: number[]) {
        this.explodeLayer.createEffect(pos);
    }

    private _createHitHp(hp: number, pos: number[]) {
        let effect: cc.Node = this.hitHpLayer.createEffect(pos);
        effect.getChildByName("Hp").getComponent(cc.Label).string = hp.toString();
    }

    private _checkAndMoveAim() {
        if (this.tracker['toGridPos'][0] - this.tracker.x > 1 || 
            this.tracker['toGridPos'][1] - this.tracker.y > 1) {

            this.tracker.x += (this.tracker['toGridPos'][0] - this.tracker.x ) * .2;
            this.tracker.y += (this.tracker['toGridPos'][1] - this.tracker.y ) * .2;

            if(this.tracker['time'] % 1 == 0){
                this.aimEffects.createEffect([this.tracker.x, this.tracker.y], false);
            }
        }
        this.tracker['time'] += 1;
    }

    update() {
        this._checkAndMoveAim();
    }
}
