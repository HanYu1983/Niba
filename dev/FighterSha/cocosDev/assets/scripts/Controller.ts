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
        let gamePage:GamePage = this.view.openPageById(0) as GamePage;
        let card:cc.Node = gamePage.table.createCard("dodge");
        card.x = card.y = 200;
        card.getComponent(Card).showCard(true);
    }
}
