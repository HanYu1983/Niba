// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import View from "./View";
import GamePage from "./gamePage/GamePage";
import Card from "./Card";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Controller extends cc.Component {

    @property(View)
    view:View = null;

    start(){
        // 覆寫方法
        window.View.AskCommand = (player, answer)=>{
            // 哪一個玩家要回答
            // 用answer物件來回答
            console.log(player, answer)
            answer.CmdUseCard("override")
        }
        // 畫場景
        window.View.Render = (gameplay)=>{
            console.log("render")
            console.log(gameplay)
        }
        // 和Model溝通
        console.log(window.Model)
        // 開始遊戲時呼叫
        window.Model.StartGameplay()

        this.debug();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    onKeyUp(evt: cc.Event.EventKeyboard){
        let currentPage = this.view.getCurrentPage();
        if(currentPage){
            switch(evt.keyCode){
                case cc.macro.KEY.w: currentPage.onUpClick(currentPage);break;
                case cc.macro.KEY.a: currentPage.onLeftClick(currentPage);break;
                case cc.macro.KEY.s: currentPage.onDownClick(currentPage);break;
                case cc.macro.KEY.d: currentPage.onRightClick(currentPage);break;
                case cc.macro.KEY.enter: currentPage.onEnterClick(currentPage);break;
                case cc.macro.KEY.escape: currentPage.onEscClick(currentPage);break;
            }
        }
        
    }

    debug(){
        let gamePage:GamePage = this.view.openPageById(0) as GamePage;
        cc.tween(this.node).call(()=>{
            let cards:Array<any> = [];
            cards.push({id:"act_attack", key:"1"});
            cards.push({id:"act_dodge", key:"2"});
            cards.push({id:"act_craft", key:"3"});
            cards.push({id:"act_money", key:"4"});
            gamePage.playerDetail.cards.createCards(cards);
            gamePage.changeToPlayCard();
            gamePage.playerDetail.myInfo.setHP(3);
        }).delay(1).call(()=>{
            gamePage.playerDetail.cards.toggleCard("3", true);
            gamePage.playerDetail.myInfo.setMoney(4);
        }).delay(1).call(()=>{
            gamePage.playerDetail.cards.toggleCard("2");
            gamePage.playerDetail.cards.toggleCard("3", false);
            gamePage.playerDetail.cards.toggleCard("4");
            gamePage.playerDetail.myInfo.setCardCount(2);
        }).delay(2).call(()=>{
            gamePage.playerDetail.cards.removeCardByKey("2");
            gamePage.playerDetail.cards.listCard();
        }).delay(2).call(()=>{
            let cards:Array<any> = [];
            cards.push({id:"act_craft", key:"5"});
            cards.push({id:"act_money", key:"6"});
            gamePage.playerDetail.cards.createCards(cards);
        }).start();
    }
}
