// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Cards from "./Cards";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInfo extends cc.Component {

    @property(cc.Label)
    lblName:cc.Label = null;

    @property(cc.Sprite)
    jobImage:cc.Sprite = null;

    @property(cc.Node)
    hpIcons:cc.Node[] = [];

    @property(cc.Node)
    moneyIcons:cc.Node[] = [];

    @property(cc.Node)
    cardIcons:cc.Node[] = [];

    @property(Cards)
    cards:Cards = null;

    setJob(job:string){
        
    }

    setHP(count:number){
        this.showIcon(this.hpIcons, count);
    }

    setMoney(count:number){
        this.showIcon(this.moneyIcons, count);
    }

    setCardCount(count:number){
        this.showIcon(this.cardIcons, count);
    }

    showIcon(icons:cc.Node[], count:number){
        for(let i = 0; i < icons.length; ++i){
            icons[i].opacity = i < count ? 255 : 30;
        }
    }

    equipWeapon(equip:boolean = false){

    }

    equipArmor(equip:boolean = false){

    }

    equipRing(equip:boolean = false){
        
    }
}
