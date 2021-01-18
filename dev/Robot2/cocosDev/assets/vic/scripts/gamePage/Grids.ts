// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate } from 'cc';
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
    }

    protected checkData(data:any):any{
        return data.GameplayPages["10"].Map;
    }

    doBuild(content:any, data:any):void{
        for (let i = 0; i < content.length; ++i) {
            for (let j = 0; j < content[i].length; ++j) {
                let node:Node = this.pool.aquire(this.prefab, this.node);
                node.getComponent(Grid).setType(content[j][i]);
                this.grids.push(node);
            }
        }
    }

}
