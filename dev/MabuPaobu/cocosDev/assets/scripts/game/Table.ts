
import { _decorator, Component, Node, Vec2 } from 'cc';
import { View } from '../View';
import { Chesses } from './Chesses';
const { ccclass, property } = _decorator;

@ccclass('Table')
export class Table extends Component {
    
    @property(Node)
    cursor:Node;

    @property(Chesses)
    chesses:Chesses;

    setCursorByGrid(grid:Vec2){
        const pos = View.convertToPos(grid);
        this.cursor.setPosition(pos);
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
