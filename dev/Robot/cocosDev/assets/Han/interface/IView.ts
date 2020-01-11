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
    updateSystemMenu(data: any, cb: () => void);
    updateUnitMenu(data: any, cb: () => void);
    updateUnitSelectMovePosition(data: { cursor: number[][] }, cb: () => void);
    updateUnitSelectSingleTarget(data: any, cb: () => void);
    updateUnitBattleMenu(data: any, cb: () => void);
    unitMoveAnim(data: { unit: IUnit, path: number[][] }, cb: () => void);
    unitBattleAnim(data: any, cb: () => void);
}