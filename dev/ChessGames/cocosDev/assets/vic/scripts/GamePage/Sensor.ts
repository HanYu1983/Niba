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

    private gridBorders:Node[] = [];

    onEnter:(node:Node)=>void|null = null;
    onLeave:(node:Node)=>void|null = null;
    onClick:(node:Node)=>void|null = null;

    addListener(arg?:any){
        super.addListener(arg);
        this.gridBorders.forEach(grid=>{
            grid.on(Node.EventType.MOUSE_ENTER, (evt:EventMouse)=>{
                let _grid:Node = evt.currentTarget;
                _grid.getComponent(GridBorder)?.showFocus(true);

                if(this.onEnter) this.onEnter(_grid);
            }, this);
            
            grid.on(Node.EventType.MOUSE_LEAVE, (evt:EventMouse)=>{
                let _grid:Node = evt.currentTarget;
                _grid.getComponent(GridBorder)?.showFocus(false);

                if(this.onLeave) this.onLeave(_grid);
            }, this);

            grid.on(Node.EventType.MOUSE_DOWN, (evt:EventMouse)=>{
                let _grid:Node = evt.currentTarget;
                if(this.onClick) this.onClick(_grid);
            }, this);
            // if (arg && arg.hasOwnProperty("callback")){
            //     grid.on(Node.EventType.MOUSE_DOWN, arg.callback);
            // }
        });
    }

    removeListener(arg?:any){
        super.removeListener(arg);
        this.gridBorders.forEach(grid=>{
            grid.off(Node.EventType.MOUSE_ENTER);
            grid.off(Node.EventType.MOUSE_LEAVE);
            grid.off(Node.EventType.MOUSE_DOWN);
            grid.getComponent(GridBorder)?.showFocus(false);
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

            this.gridBorders.push(gridBorderNode);
        }

        super.open(arg);
    }

    close(arg?:any){
        super.close(arg);

        this.node.removeAllChildren();
    }

}
