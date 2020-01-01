import IUnit from "../interface/IUnit";

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
}