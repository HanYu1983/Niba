// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, log, EventMouse } from 'cc';
import { BasicViewer } from '../../lib/BasicViewer';
import { GridBorder } from './GridBorder';
const { ccclass, property } = _decorator;

@ccclass('Sensor')
export class Sensor extends BasicViewer {

    @property(Node)
    public gridBorderPrefab:Node = null;

    private _gridBorders:Node[] = [];

    addListener(arg?:any){
        super.addListener(arg);
        this._gridBorders.forEach(grid=>{
            grid.on(Node.EventType.MOUSE_ENTER, function (evt:EventMouse) {
                let _grid:Node = evt.currentTarget;
                _grid.getComponent(GridBorder)?.showFocus(true);
            }, this);
            
            grid.on(Node.EventType.MOUSE_LEAVE, function (evt:EventMouse) {
                let _grid:Node = evt.currentTarget;
                _grid.getComponent(GridBorder)?.showFocus(false);
            }, this);

            if (arg && arg.hasOwnProperty("callback")){
                grid.on(Node.EventType.MOUSE_DOWN, arg.callback);
            }
        });
    }

    removeListener(arg?:any){
        super.removeListener(arg);
        this._gridBorders.forEach(grid=>{
            grid.off(Node.EventType.MOUSE_ENTER);
            grid.off(Node.EventType.MOUSE_LEAVE);
            grid.off(Node.EventType.MOUSE_DOWN);
        });
    }

    open(arg?:any){

        for(let i = 0; i < 90; ++i){
            let gridBorderNode = instantiate(this.gridBorderPrefab);
            let x = i % 9;
            let y = Math.floor(i / 9);
            gridBorderNode.name = x + "_" + y;
            gridBorderNode.active = true;
            gridBorderNode.setParent(this.node);

            this._gridBorders.push(gridBorderNode);
        }

        super.open(arg);
    }

    close(arg?:any){
        super.close(arg);

        this.node.removeAllChildren();
    }

}
