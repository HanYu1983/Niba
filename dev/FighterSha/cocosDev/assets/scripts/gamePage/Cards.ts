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

    createCard(id:string, key:string, x, y){
        let card:cc.Node = this.cardPool.acquire();
        card.active = true;
        card.x = x;
        card.y = y;
        card.setParent(this.node);
        card.getComponent(Card).setCard(id, key);
        this.cards.push(card);
        return card;
    }

    createCards(cards:Array<any>){
        this.clearCards();
        for(let i = 0; i < cards.length; ++i){
            cc.log(cards[i]);
            const card = cards[i];
            const show = card["card-face"];
            const id = card["card-proto-id"];
            const key = card["card-id"];
            const state = card["card-state"];
            const playerId = card["player-id"];
            const targetX = i*110+80;
            this.createCard("act_attack", key, targetX, 0);
        }
    }

    clearCards(){
        for(let i = this.cards.length - 1; i > 0; --i){
            this.removeCardByIndex(i);
        }
        this.cards = [];
    }

    getCount(){
        return this.cards.length;
    }

    focusCardByKey(key:string){
        let card = this.getCardByKey(key);
        if(card){
            card.getComponent(Card).focusCard(true);
        }
    }

    focusCardByIndex(index:number){
        if ( index < this.cards.length ){
            this.cards[index].getComponent(Card).focusCard(true);
        }
    }

    focusOnlyOneCard(index:number){
        this.clearFocus();
        this.focusCardByIndex(index);
    }

    clearFocus(){
        this.cards.forEach(card=>{
            card.getComponent(Card).focusCard(false);
        });
    }

    getCardByKey(key:string){
        let returnCard = null;
        this.cards.forEach(card=>{
            if(card.getComponent(Card).isCard(key)){
                returnCard = card;
                return;
            }
        });
        return returnCard;
    }

    getCardByIndex(index:number){
        if ( index < this.cards.length ){
            return this.cards[index];
        }
        return null;
    }

    removeCardByKey(key:string){
        for(let i = this.cards.length - 1; i > 0; --i){
            let card = this.cards[i];
            if(card.getComponent(Card).isCard(key)){
                this.removeCardByIndex(i);
                break;
            }
        }
    }

    removeCardByIndex(index:number){
        let card = this.getCardByIndex(index);
        card.active = false;
        this.cards.splice(index, 1);
        this.cardPool.release(card);
    }

    toggleCard(key:string, force:boolean = null){
        let card = this.getCardByKey(key);
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
