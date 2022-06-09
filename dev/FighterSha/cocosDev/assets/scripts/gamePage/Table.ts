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

    deck:Array<cc.Node> = [];

    createCard(id:string){
        let card:cc.Node = this.cardPool.acquire();
        card.active = true;
        card.setParent(this.node);
        card.getComponent(Card).setCard(id);
        return card;
    }

    showHand(cards:any[]){
        for(let i = 0; i < cards.length; ++i){
            let card = this.createCard("attack");
            this.deck.push(card);
        }
    }

    createDeck(datas:any){
        for(let i = 0; i < datas.length; ++i){
            let card = this.createCard("attack");
            this.deck.push(card);
        }
    }

    drawFromDeck(count:number){
        let cards = [];
        if(this.deck.length > count){
            cards.push(this.deck.pop());
        }
        return cards;
    }

    moveCards(cards, pos){

    }
}
