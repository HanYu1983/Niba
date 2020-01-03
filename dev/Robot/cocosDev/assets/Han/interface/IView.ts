export default interface IView {
    updateMap(data: number[][], cb: () => void);
    updateUnits(data: any, cb: () => void);
    playerTurnStart(data: any, cb: () => void);
    enemyTurnStart(data: string, cb: () => void);
    updatePlayTurn(data: any, cb: () => void);
    updateSystemMenu(data: any, cb: () => void);
    updateUnitMenu(data: any, cb: () => void);
    updateUnitSelectMovePosition(data: any, cb: () => void);
    unitMoveAnim(data: any, cb: () => void);
}