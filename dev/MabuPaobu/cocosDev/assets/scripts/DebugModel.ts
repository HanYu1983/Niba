
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugModel')
export class DebugModel extends Component {
    
    startGame(){
        console.log('start game');
        
    }

    getTable(){
        return [
            {id:0, type:0, pos:[5, 5], player:0},
            {id:1, type:1, pos:[19, 19], player:1}
        ]
    }

    getGridModel(x:number, y:number){

        // if empty
        // return null;
        
        return {id:4, type:1, pos:[x, y], player:0};

        
    }

    getChessMoveRangeById(id:number){
        return [
            [0, 0], [0, 1], [0, 2]
        ]
    }

    isPlayer(id:number){
        return id == 0;
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
