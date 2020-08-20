// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "./lib/BasicViewer";
import ImagesAssets from "./lib/ImagesAssets";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends BasicViewer {


    @property(cc.Sprite)
    image:cc.Sprite = null;

    @property(cc.Node)
    cover:cc.Node = null;

    @property(cc.Node)
    focus:cc.Node = null;

    private cardId:string = "attack";
    private cardKey:string = "";

    setCard(id:string, key:string){
        this.cardId = id;
        this.image.spriteFrame = ImagesAssets.Instance.getImageByKey(this.cardId);

        this.cardKey = key;
    }

    getCardKey(){
        return this.cardKey;
    }

    focusCard(focus:boolean){
        this.focus.active = focus;
    }

    showCard(show:boolean){
        this.cover.active = !show;
    }

    toggleCard(){
        this.showCard(!this.isShow());
    }

    isShow(){
        return !this.cover.active;
    }

    isCard(key:string){
        return this.cardKey == key;
    }
}
