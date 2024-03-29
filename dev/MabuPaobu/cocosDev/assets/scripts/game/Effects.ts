
import { _decorator, Component, Node, tween, Vec2, Vec3, Animation, Color } from 'cc';
import { Pool } from '../lib/Pool';
import { Viewer } from '../lib/Viewer';
import { ActionModel, DirectType, PlayerModel } from '../Type';
import { View } from '../View';
import { BigMsgEffect } from './BigMsgEffect';
import { Chess } from './Chess';
import { ChessMoveEffect } from './ChessMoveEffect';
import { KillEffect } from './KillEffect';
import { PlayerInfo } from './PlayerInfo';
const { ccclass, property } = _decorator;

@ccclass('Effects')
export class Effects extends Component {
    
    // @property(ChessMoveEffect)
    // chessMoveEffect:ChessMoveEffect;

    @property(Node)
    cursor:Node;

    @property(Chess)
    chess:Chess;

    @property(Node)
    itemExplode:Node;

    @property(Node)
    itemBigExplode:Node;

    @property(Node)
    itemLaser:Node;

    @property(Node)
    itemBigLaser:Node;

    @property(Pool)
    killEffects:Pool;

    @property(BigMsgEffect)
    turnChange:BigMsgEffect;

    start(){
        this.itemExplode.setScale(Vec3.ZERO);
        this.itemLaser.setScale(Vec3.ZERO);
        this.itemBigLaser.setScale(Vec3.ZERO);
        this.itemBigExplode.setScale(Vec3.ZERO);
    }
    
    createChessMoveEffect(chessModel:any, fromGrid:Vec2, toGrid:Vec2){
        const from = View.convertToPos(fromGrid);
        const to = View.convertToPos(toGrid);

        // 移動特效用的棋子不需要顯示buff count
        const clone = {...chessModel};
        clone.buffCount = 0;

        this.chess.open(clone);
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

    createTurnChangeEffect(playerInfo:PlayerModel){
        const msg = playerInfo.name + '的回合';
        const color = View.getPlayerColor(playerInfo.id);
        this.createBigMsg(msg, color);
    }

    createVictoryEffect(name:string){
        this.createBigMsg(name + '獲勝了', Color.BLUE, 1);
    }

    createLoseEffect(name:string){
        this.createBigMsg(name + '被打敗了', Color.RED, 1);
    }

    createAgainEffect(){
        this.createBigMsg('感謝你的游玩. 即將回到首頁.', Color.BLUE, 1);
    }

    createItemExplode(grid:Vec2){
        this.createExplodeType(this.itemExplode, grid, 1.2);
    }

    createBigExplode(grid:Vec2){
        this.createExplodeType(this.itemBigExplode, grid, 1.8);
    }

    createLaser(grid:Vec2, dir:DirectType){
        this.createLaserType(this.itemLaser, grid, dir, .8);
    }

    createBigLaser(grid:Vec2, dir:DirectType){
        this.createLaserType(this.itemBigLaser, grid, dir, 2);
    }

    private createBigMsg(content:string, color:Color = Color.BLUE, timescale = 1){
        this.turnChange.open({content:content, color:color});
        this.turnChange.node.setScale(new Vec3(1, 0, 1));

        tween(this.turnChange.node).to(.3 * timescale, {scale:Vec3.ONE}, {easing:'quadOut'}).
        delay(.5 * timescale).
        to(.3 * timescale, {scale:new Vec3(1,0,1)}, {easing:'quadOut'}).
        call(()=>{this.turnChange.close();}).
        start();
    }

    private createExplodeType(explode:Node, grid:Vec2, time:number){
        const pos = View.convertToPos(grid);

        explode.setScale(Vec3.ONE);
        explode.setPosition(pos);
        explode.getComponent(Animation)?.play();
        tween(this.node).delay(time).call(()=>{
            explode.setScale(Vec3.ZERO);
        }).start();
    }

    private createLaserType(laser:Node, grid:Vec2, dir:DirectType, time:number){
        let pos = View.convertToPos(grid);
        let rot = new Vec3();

        if(dir == DirectType.Horizontal){
            pos.x = 0;
        }else{
            pos.y = 0;
            rot.z = 90;
        }

        laser.setScale(Vec3.ONE);
        laser.setPosition(pos);
        laser.setRotationFromEuler(rot);
        laser.getComponent(Animation)?.play();
        tween(this.node).delay(time).call(()=>{
            laser.setScale(Vec3.ZERO);
        }).start();
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
