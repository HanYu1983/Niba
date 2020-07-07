// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponMenuItem extends cc.Component {

    @property(cc.Label)
    weaponName: cc.Label = null;

    @property(cc.Label)
    weaponType: cc.Label = null;

    @property(cc.Label)
    weaponPower: cc.Label = null;

    @property(cc.Label)
    weaponRange: cc.Label = null;

    @property(cc.Label)
    weaponHit: cc.Label = null;

    @property(cc.Label)
    weaponEN: cc.Label = null;

    @property(cc.Label)
    weaponBullet: cc.Label = null;

    @property(cc.Sprite)
    backColor:cc.Sprite = null;

    @property(cc.Sprite)
    coverColor:cc.Sprite = null;
}
