const { ccclass, property } = cc._decorator;

@ccclass
export default class UnitSampleInfo extends cc.Component {

    @property(cc.Sprite)
    hpSprite: cc.Sprite = null;

    @property(cc.Sprite)
    enSprite: cc.Sprite = null;

    showHPEN(maxHP: number, hp: number, maxEN: number, en: number) {
        this.hpSprite.node.scaleX = hp / maxHP;
        this.enSprite.node.scaleX = en / maxEN;
    }

    changeHP(maxHP: number, hp: number) {
        cc.tween(this.hpSprite.node).to(.7, { scaleX: hp / maxHP }, { easing: 'quartOut' }).start();
    }

    changeEN(maxEN: number, en: number) {
        cc.tween(this.enSprite.node).to(.7, { scaleX: en / maxEN }, { easing: 'quartOut' }).start();
    }

}
