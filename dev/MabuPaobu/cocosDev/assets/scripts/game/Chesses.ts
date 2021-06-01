
import { _decorator, Component, Node, Color } from 'cc';
import { Pool } from '../lib/Pool';
import { Chess } from './Chess';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Chesses')
@requireComponent(Pool)
export class Chesses extends Component {
    
    private chessPool: Pool;

    start(){
        this.chessPool = this.getComponent(Pool);
    }

    createHorse(id:number){
        const chess = this.chessPool.getNode();
        if(chess){
            let chessComp = chess.getComponent(Chess);
            if(chessComp){
                chessComp.setNameAndColor('馬', Color.RED);
            }
        }
    }

    createCannon(){
        const chess = this.chessPool.getNode();
        if(chess){
            let chessComp = chess.getComponent(Chess);
            if(chessComp){
                chessComp.setNameAndColor('炮', Color.BLUE);
            }
        }
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
