// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Grid from './Grid';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    prefabGrid: cc.Node = null;

    @property(cc.Node)
    gridContainer:cc.Node = null;

    private grids: Map<string, Grid> = new Map();

    initPool() {
        for (let i = 0; i < 400; ++i) {
            let gridNode: cc.Node = cc.instantiate(this.prefabGrid);
            gridNode.setParent(this.gridContainer);
            gridNode.active = true;

            let grid: Grid = gridNode.getComponent(Grid);
            grid.setType(Math.floor(Math.random() * 6));
            grid.landX = i % 20;
            grid.landY = Math.floor(i / 20);

            this.grids.set(grid.landX + ":" + grid.landY, grid);
        }
    }

    setMap(data:any[]){
        let id = 0;
        data.forEach(element=>{
            let x = id % 20;
            let y = Math.floor(id / 20);
            let grid = this.getGridByXY(x, y);
            if(grid){
                grid.setType(element);
            }
            id++;
        });
    }

    /**
     * 用這個方法要檢查物件是不是undefined
     * @param x 
     * @param y 
     */
    getGridByXY(x: number, y: number):Grid {
        let grid = this.grids.get(x + ":" + y);
        return grid;
    }

    focusOnGrid(x:number, y:number){
        this.grids.forEach(grid => {
            grid.showFocus(false);
        });
        let grid = this.getGridByXY(x, y);
        if(grid){
            grid.showFocus(true);
        }
    }
}
