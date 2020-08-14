// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Pool from "../lib/Pool";
import Card from "../Card";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Table extends cc.Component {

    @property(Pool)
    cardPool:Pool = null;

    createCard(id:string){
        let card:cc.Node = this.cardPool.acquire();
        card.active = true;
        card.setParent(this.node);
        card.getComponent(Card).setCard(id);
        return card;
    }
}
