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

    private cardId:string = "attack";

    setCard(id:string){
        this.cardId = id;
        this.image.spriteFrame = ImagesAssets.Instance.getImageByKey(this.cardId);
    }

    showCard(show:boolean){
        
    }
}
