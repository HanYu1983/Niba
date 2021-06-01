
import { _decorator, Component, Node, SystemEventType, Vec2, Vec3, Pool } from 'cc';
import { DebugModel } from './DebugModel';
import { Table } from './game/Table';
import { Tool } from './lib/Tool';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Component {

    @property(DebugModel)
    model:DebugModel = null;

    @property(Table)
    table:Table = null;

    start(){
        this.model.startGame();

        const chess:Array<any> = this.model.getTable();
        chess.forEach(elem=>{
            this.table.chess
        });

        this.table.node.on(SystemEventType.MOUSE_MOVE, (e:any)=>{
            const localPos = Tool.getLocal(e._x, e._y, e.currentTarget);
            const grid = View.convertToGrid(localPos);
        
            this.table.setCursorByGrid(grid);
        });

    }

    static convertToGrid(local:Vec2){
        const offset = new Vec2(local.x + 300, local.y + 300);
        return new Vec2(Math.floor(offset.x / 30), Math.floor(offset.y / 30))
    }

    static convertToPos(grid:Vec2){
        const offset = new Vec2(grid.x * 30 - 300 + 15, grid.y * 30 - 300 + 15);
        return new Vec3(offset.x, offset.y, 0);
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
