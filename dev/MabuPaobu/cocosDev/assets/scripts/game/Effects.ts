
import { _decorator, Component, Node, tween, Vec2, Vec3, Animation } from 'cc';
import { Pool } from '../lib/Pool';
import { Viewer } from '../lib/Viewer';
import { ActionModel } from '../Type';
import { View } from '../View';
import { Chess } from './Chess';
import { ChessMoveEffect } from './ChessMoveEffect';
import { KillEffect } from './KillEffect';
const { ccclass, property } = _decorator;

@ccclass('Effects')
export class Effects extends Component {
    
    // @property(ChessMoveEffect)
    // chessMoveEffect:ChessMoveEffect;

    @property(Node)
    cursor:Node;

    @property(Chess)
    chess:Chess;

    @property(KillEffect)
    explode:KillEffect;

    @property(Pool)
    killEffects:Pool;

    @property(Viewer)
    turnChange:Viewer;

    start(){
        this.explode.close();
    }
    
    createChessMoveEffect(chessModel:any, fromGrid:Vec2, toGrid:Vec2){
        const from = View.convertToPos(fromGrid);
        const to = View.convertToPos(toGrid);

        this.chess.open(chessModel);
        this.chess.node.setPosition(from);

        tween(this.chess.node).to(.5, {scale:new Vec3(1.2, 1.2, 1)}, {easing:'elasticOut'}).
        delay(.2).
        to(.3, {position:to}).
        to(.5, {scale:Vec3.ONE}, {easing:'elasticOut'}).
        call(()=>{
            this.chess.close();
        }).
        start();
    }

    createExplode(grid:Vec2, result:ActionModel){
        const pos = View.convertToPos(grid);

        const explode = this.killEffects.getNode();
        if(explode){
            explode.getComponent(KillEffect)?.open(result);
            explode.setPosition(pos);
    
            tween(this.node).delay(1).call(()=>{
                explode.getComponent(KillEffect)?.close();
                this.killEffects.releaseNode(explode);
            }).start();
        }
    }

    createTurnChangeEffect(){
        this.turnChange.open();
        this.turnChange.node.setScale(new Vec3(1, 0, 1));

        tween(this.turnChange.node).to(.3, {scale:Vec3.ONE}, {easing:'quadOut'}).
        delay(.5).
        to(.3, {scale:new Vec3(1,0,1)}, {easing:'quadOut'}).
        call(()=>{this.turnChange.close();}).
        start();
    }

    showCursor(){
        this.cursor.scale = Vec3.ONE;
    }

    hideCursor(){
        this.cursor.scale = Vec3.ZERO;
    }
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
