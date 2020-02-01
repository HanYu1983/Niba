import Grid from './Grid';
const { ccclass, property } = cc._decorator;

@ccclass
export default class LandMap extends cc.Component {

    @property(cc.Node)
    prefabGrid: cc.Node = null;

    @property(cc.Node)
    gridContainer: cc.Node = null;

    private grids: Map<string, Grid> = new Map();

    initPool() {
        for (let i = 0; i < 400; ++i) {
            let gridNode: cc.Node = cc.instantiate(this.prefabGrid);
            gridNode.setParent(this.gridContainer);
            gridNode.active = true;

            let grid: Grid = gridNode.getComponent(Grid);
            grid.landX = i % 20;
            grid.landY = Math.floor(i / 20);

            this.grids.set(grid.landX + ":" + grid.landY, grid);
        }
    }

    resetUV() {
        this.grids.forEach((grid: Grid, key: string) => {
            grid.resetUV();
        });
    }

    setMap(data: any[]) {
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[i].length; ++j) {
                let grid = this.getGridByXY([j, i]);
                if (grid) {
                    grid.setType(data[i][j]);
                }
            }
        }
    }

    setMapOneLevel(data: number[]) {
        for (let i = 0; i < data.length; ++i) {
            let x = i % 20;
            let y = Math.floor(i / 20);
            let grid = this.getGridByXY([x, y]);
            if (grid) {
                grid.setType(data[i]);
            }
        }
    }

    showMovableGrid(data: any[]) {
        this.clearRange();
        data.forEach(elem => {
            let grid: Grid = this.getGridByXY(elem);
            if (grid) {
                grid.showMoveRange();
            }
        });
    }

    showWeaponRange(data: any[]) {
        this.closeWeaponRange();
        data.forEach(elem => {
            let grid: Grid = this.getGridByXY(elem);
            if (grid) {
                grid.showWeaponRange();
            }
        });
    }

    showMapRange(data: any[]) {
        this.closeMapRange();
        data.forEach(elem => {
            let grid: Grid = this.getGridByXY(elem);
            if (grid) {
                grid.showMapRange();
            }
        });
    }

    closeMapRange() {
        this.grids.forEach(grid => {
            grid.showMapRange(false);
        });
    }

    closeWeaponRange() {
        this.grids.forEach(grid => {
            grid.showWeaponRange(false);
        });
    }

    clearRange() {
        this.grids.forEach(grid => {
            grid.showNormal();
        });
    }

    /**
     * 用這個方法要檢查物件是不是undefined
     * @param x 
     * @param y 
     */
    getGridByXY(pos: number[]): Grid {
        let grid = this.grids.get(pos[0] + ":" + pos[1]);
        return grid;
    }

    // focusOnGrid(x:number, y:number){
    //     this.grids.forEach(grid => {
    //         grid.showFocus(false);
    //     });
    //     let grid = this.getGridByXY(x, y);
    //     if(grid){
    //         grid.showFocus(true);
    //     }
    // }
}
