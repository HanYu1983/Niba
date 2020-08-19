// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Table from "./Table";
import PlayerDetail from "./PlayerDetail";
import StateController from "../lib/StateController";
import StatePlayCard from "./StatePlayCard";
import BasicStateViewer from "../lib/BasicStateViewer";
import DefaultState from "../lib/DefaultState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePage extends BasicStateViewer {
    @property(Table)
    table:Table = null;

    @property(PlayerDetail)
    playerDetail:PlayerDetail = null;

    start(){
        
    }

    changeToPlayCard(){
        this.getComponent(StateController).changeState(new StatePlayCard(this));
    }

    onUpClick(){
        this.getComponent(StateController).onUpClick();
    }
    onDownClick(){
        this.getComponent(StateController).onDownClick();
    }
    onLeftClick(){
        this.getComponent(StateController).onLeftClick();
    }
    onRightClick(){
        this.getComponent(StateController).onRightClick();
    }
    onEnterClick(){
        this.getComponent(StateController).onEnterClick();
    }
    onEscClick(){
        this.getComponent(StateController).onEscClick();
    }
}
