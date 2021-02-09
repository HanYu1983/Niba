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
        const map = content.Map;
        if(map){
            for (let i = 0; i < map.length; ++i) {
                for (let j = 0; j < map[i].length; ++j) {
                    let node:Node = this.pool.aquire(this.prefab, this.node);
                    node.getComponent(Grid)?.setType(map[j][i]);
                    node.getComponent(Grid)?.showNormal();
                    node.getComponent(Grid).landX = i;
                    node.getComponent(Grid).landY = j;
                    
                    node.setPosition(Grids.getGridPos(i, j));
                    this.grids.push(node);
                }
            }
        }

        const atkRange = content.AttackRange;
        if(atkRange) this.showAttackRange(atkRange);

        const moveRange = content.MoveRange;
        if(moveRange) this.showMoveRange(moveRange);
    }

    static getGridPos(x:number, y:number):Vec3{
        return new Vec3(x * 32 - 304, -y * 32 + 304 ,0);
    }
    
    getGrid(x:number, y:number):Node|null{
        let outputGrid = null;
        for(let i = 0; i < this.grids.length; ++i){
            const grid = this.grids[i];
            if(grid.getComponent(Grid).landX == x && grid.getComponent(Grid).landY == y){
                outputGrid = grid;
                break;
            }
        }
        return outputGrid;
    }

    showAttackRange(ranges:any[]){
        ranges.forEach(range=>{
            const grid = this.getGrid(range[0], range[1]);
            
            if(grid){
                grid.getComponent(Grid)?.showWeaponRange(true);
            }
        });
    }

    showMoveRange(ranges:any[]){
        ranges.forEach(range=>{
            const grid = this.getGrid(range[0], range[1]);
            
            if(grid){
                grid.getComponent(Grid)?.showMoveRange(true);
            }
        });
    }
}
