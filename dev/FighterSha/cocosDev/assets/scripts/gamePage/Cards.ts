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
export default class Cards extends cc.Component {

    cardPool:Pool = null;

    private cards:Array<cc.Node> = [];

    start(){
        this.cardPool = this.node.getComponent(Pool);
    }

    createCard(id:string, key:string){
        let card:cc.Node = this.cardPool.acquire();
        card.active = true;
        card.x = 1200;
        card.y = 0;
        card.setParent(this.node);
        card.getComponent(Card).setCard(id, key);
        this.cards.push(card);
        return card;
    }

    createCards(cards:Array<any>){
        for(let i = 0; i < cards.length; ++i){
            const id = cards[i].id;
            const key = cards[i].key;
            this.createCard(id, key);
        }
        this.listCard();
    }

    getCard(key:string){
        let returnCard = null;
        this.cards.forEach(card=>{
            if(card.getComponent(Card).isCard(key)){
                returnCard = card;
                return;
            }
        });
        return returnCard;
    }

    removeCard(key:string){
        for(let i = this.cards.length - 1; i > 0; --i){
            let card = this.cards[i];
            if(card.getComponent(Card).isCard(key)){
                card.active = false;
                this.cards.splice(i, 1);
                this.cardPool.release(card);
                break;
            }
        }
    }

    toggleCard(key:string, force:boolean = null){
        let card = this.getCard(key);
        cc.log(card);
        if(card){
            if(force){
                card.getComponent(Card).showCard(force);
            }else{
                card.getComponent(Card).toggleCard();
            }
        }
        
    }

    listCard(){
        let startTime = 0;
        for(let i = 0; i < this.cards.length; ++i){
            let card = this.cards[i];
            const targetX = i*110+80;
            cc.tween(card).delay(startTime * .3).to(.3, {x:targetX}, {easing:'sineOut'}).start();

            // delay的時間要跳過不需要整理的卡片
            if(card.x != targetX){
                startTime++;
            }
        }
    }
}
