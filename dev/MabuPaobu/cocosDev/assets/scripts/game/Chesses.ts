
import { _decorator, Component, Node, Color, Vec2 } from 'cc';
import { Pool } from '../lib/Pool';
import { ChessModel } from '../Type';
import { View } from '../View';
import { Chess } from './Chess';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Chesses')
@requireComponent(Pool)
export class Chesses extends Component {
   
    create(chessModel:ChessModel){
        const chess = this.getComponent(Pool)?.getNode();
        if(chess){
            let chessComp = chess.getComponent(Chess);
            if(chessComp){
                chessComp.open(chessModel);
            }
            const pos = View.convertToPos(chessModel.pos);
            chess.setPosition(pos);
        }
    }

    releaseAllNodes(){
        this.getComponent(Pool)?.getUsingNodes().forEach(elem=>{
            elem.getComponent(Chess)?.close();
        });
        this.getComponent(Pool)?.releaseAllNodes();
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
