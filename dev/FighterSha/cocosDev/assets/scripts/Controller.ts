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
    view:View;

    start(){
        // 覆寫方法
        window.View.AskCommand = (player, answer)=>{
            // 哪一個玩家要回答
            // 用answer物件來回答
            console.log(player, answer)
            answer.CmdUseCard("override")
        }
        // 和Model溝通
        console.log(window.Model)
        // 開始遊戲時呼叫
        window.Model.StartGameplay()

        let gamePage:GamePage = this.view.openPageById(0) as GamePage;
        cc.tween(this.node).call(()=>{
            let cards:Array<any> = [];
            cards.push({id:"attack", key:"1"});
            cards.push({id:"dodge", key:"2"});
            cards.push({id:"craft", key:"3"});
            cards.push({id:"money", key:"4"});
            gamePage.playerDetail.cards.createCards(cards);
        // }).delay(1).call(()=>{
        //     gamePage.playerDetail.cards.toggleCard("3", true);
        // }).delay(1).call(()=>{
        //     gamePage.playerDetail.cards.toggleCard("2");
        //     gamePage.playerDetail.cards.toggleCard("3", false);
        //     gamePage.playerDetail.cards.toggleCard("4");
        }).delay(2).call(()=>{
            gamePage.playerDetail.cards.removeCard("2");
            gamePage.playerDetail.cards.listCard();
        }).delay(2).call(()=>{
            let cards:Array<any> = [];
            cards.push({id:"craft", key:"5"});
            cards.push({id:"money", key:"6"});
            gamePage.playerDetail.cards.createCards(cards);
        }).start();
    }
}
