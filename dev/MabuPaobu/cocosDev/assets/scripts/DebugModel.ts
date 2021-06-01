
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugModel')
export class DebugModel extends Component {
    
    startGame(){
        console.log('start game');
        
    }

    getTable(){
        return [
            {id:0, type:0, pos:[0, 0], player:0},
            {id:1, type:1, pos:[20, 20], player:1}
        ]
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
