const {ccclass, property} = cc._decorator;

@ccclass
export default class UnitSampleInfo extends cc.Component {

    @property(cc.Sprite)
    hpSprite:cc.Sprite = null;

    @property(cc.Sprite)
    enSprite:cc.Sprite = null;

    // maxHP:number;
    // maxEN:number;
    // currentHP:number;
    // currentEN:number;

    showHPEN(maxHP:number, hp:number, maxEN:number, en:number){
        this.hpSprite.node.scaleX = hp / maxHP;
        this.enSprite.node.scaleX = en / maxEN;
    }

}
