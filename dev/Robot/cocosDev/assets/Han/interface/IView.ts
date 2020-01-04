import IUnit from "./IUnit"

export default interface IView {
    updateMap(data: number[][], cb: () => void);
    updateUnits(data: IUnit[], cb: () => void);
    updateCursor(data: number[], cb: () => void);
    updateMoveRange(data: number[][], cb: () => void);
    updateAttackRange(data: number[][], cb: () => void);
    updateMapAttackRange(data: number[][], cb: () => void);

    playerTurnStart(data: any, cb: () => void);
    enemyTurnStart(data: string, cb: () => void);
    updatePlayTurn(data: { cursor: number[] }, cb: () => void);
    updateSystemMenu(data: { menu: any[]; cursor: number; subcursor: number[] }, cb: () => void);
    updateUnitMenu(data: { menu: any[]; cursor: number; subcursor: number[] }, cb: () => void);
    updateUnitSelectMovePosition(data: { cursor: number[][] }, cb: () => void);
    unitMoveAnim(data: { unit: IUnit, path: number[][] }, cb: () => void);
}