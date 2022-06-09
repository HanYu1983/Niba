
import { _decorator, Component, Node, Vec2, Vec3, tween, Animation } from 'cc';
import { View } from '../View';
import { Chess } from './Chess';
const { ccclass, property } = _decorator;

@ccclass('ChessMoveEffect')
export class ChessMoveEffect extends Component {
    
    @property(Chess)
    chess:Chess;

    create(chessModel:any, fromGrid:Vec2, toGrid:Vec2){

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
