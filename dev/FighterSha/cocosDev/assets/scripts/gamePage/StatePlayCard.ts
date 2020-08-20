// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DefaultState from "../lib/DefaultState";
import GamePage from "./GamePage";
import PlayerDetail from "./PlayerDetail";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StatePlayCard extends DefaultState {

    private focusId:number = 0;
    private playerDetail = null;

    onEnterState(){
        
        this.focusId = 0;
        this.playerDetail = (this.owner as GamePage).playerDetail;
        this.playerDetail.setAsk("請打出一張牌");
    }

    onUpClick(){
        
    }

    onDownClick(){
        
    }

    onLeftClick(){
        if(--this.focusId < 0) this.focusId = 0;
        this.playerDetail.cards.focusOnlyOneCard(this.focusId);
    }

    onRightClick(){
        if(++this.focusId > this.playerDetail.cards.getCount() - 1) this.focusId = this.playerDetail.cards.getCount() - 1;
        this.playerDetail.cards.focusOnlyOneCard(this.focusId);
    }

    onEnterClick(){
        this.playerDetail.cards.removeCardByIndex(this.focusId);
        this.playerDetail.cards.listCard();
    }

    onEscClick(){
       
    }
}
