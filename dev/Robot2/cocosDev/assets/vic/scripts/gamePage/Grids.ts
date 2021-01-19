// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, Vec3 } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { Grid } from './Grid';
const { ccclass, property } = _decorator;

@ccclass('Grids')
export class Grids extends Instant {

    @property(Node)
    prefab:Node = null;

    private grids:Node[] = [];

    clear():void{
        super.clear();
        this.grids.forEach(grid=>{
            this.pool.release(this.prefab, grid);
        });
        this.grids = [];
    }

    doBuild(content:any, data:any):void{
        for (let i = 0; i < content.length; ++i) {
            for (let j = 0; j < content[i].length; ++j) {
                let node:Node = this.pool.aquire(this.prefab, this.node);
                node.getComponent(Grid).setType(content[j][i]);

                const pos = this.getGridPos(j, i);
                let gridPos:Vec3 = node.getPosition();
                gridPos.x = pos[0];
                gridPos.y = pos[1];
                node.setPosition(gridPos);
                this.grids.push(node);
            }
        }
    }

    getGridPos(x:number, y:number):[number, number]{
        return [x * 32 - 304, -y * 32 + 304];
    }
}
