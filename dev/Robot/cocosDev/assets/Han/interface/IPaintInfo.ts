import IUnit from "./IUnit";

export default interface IPaintInfo {
    units: IUnit[]
    map: number[][]
    cursor: number[]
    moveRange: number[][]
    attackRange: number[][]
    unitMenu: {
        menuCursor: {
            cursor: number
            subcursor: number[]
            menu: string[][]
        },
        data: any
    }
    systemMenu: {
        menuCursor: {
            cursor: number
            subcursor: number[]
            menu: string[][]
        },
        data: any
    }
    state: string
    stateDetail: any
}