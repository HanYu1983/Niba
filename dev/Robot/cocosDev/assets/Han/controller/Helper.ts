import IUnit from "../interface/IUnit";
import View from "../../Vic/View";

export default class Helper {
    static projectPosition([cx, cy]: number[], [x, y]: number[]): number[] {
        return [x - cx, y - cy]
    }

    static projectUnits(camera: number[], units: IUnit[]) {
        return units.map(u => {
            u.position = Helper.projectPosition(camera, u.position);
            return u;
        })
    }

    /**
     * return unit if exist;
     */
    static checkIsUnit(units: IUnit[], [cx, cy]: number[]): IUnit {
        const find = units.filter(u => u.position[0] == cx && u.position[1] == cy);
        if (find.length == 0) {
            return null;
        }
        return find[0];
    }

    static unitMove(view: View, unitKey:string, path: number[][], cb?:()=>void){
        console.log(unitKey, path);
        if(cb){
            cb();
        }
    }
}