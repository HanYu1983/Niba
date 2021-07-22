
import { _decorator, Component, Node, SystemEventType, Vec2, Vec3, tween, systemEvent, EventKeyboard, Label, Color } from 'cc';
import { DebugModel } from './DebugModel';
import { Chess } from './game/Chess';
import { ChessMenu } from './game/ChessMenu';
import { ConfirmMenu } from './game/ConfirmMenu';
import { Effects } from './game/Effects';
import { GamePage } from './game/GamePage';
import { PlayerInfo } from './game/PlayerInfo';
import { Table } from './game/Table';
import { Pool } from './lib/Pool';
import { Tool } from './lib/Tool';
import { Viewer } from './lib/Viewer';
import { ActionModel, ActionType, ChessModel, DirectType, ItemName, Items, PlayerModel } from './Type';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Viewer {

    static inst:View;

    start(){
        View.inst = this;
        this.open();
    }

    onTitlePageClickPlayer(evt:any, count:number){
        this.openGamePage();
        this.getGamePage().getComponent(GamePage)?.restartGame(count);
    }

    onGamePageClickReturnTitle(){
        this.getGamePage().getComponent(GamePage)?.openBackToTitleDialog();
    }

    public openTitlePage(){
        this.openTargetPage(0);
    }

    private openGamePage(){
        this.openTargetPage(1);
    }

    private getTitlePage(){
        return this.pages[0];
    }

    private getGamePage(){
        return this.pages[1];
    }

    static convertToGrid(local:Vec2){
        const offset = new Vec2(local.x + 300, local.y + 300);
        return new Vec2(Math.floor(offset.x / 30), Math.floor(offset.y / 30))
    }

    static convertToPos(grid:Vec2){
        const offset = new Vec2(grid.x * 30 - 300 + 15, grid.y * 30 - 300 + 15);
        return new Vec3(offset.x, offset.y, 0);
    }

    static convertToPosByArray(pos:Array<number>){
        return View.convertToPos(new Vec2(pos[0], pos[1]));
    }

    static getPlayerColor(id:number){
        return [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN][id];
    }
}


function CCInteger(CCInteger: any) {
    throw new Error('Function not implemented.');
}
/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
