import IUnit from "./IUnit"
import IPaintInfo from "./IPaintInfo";

export default interface IView {
    playerTurnStart(data: any, cb: () => void);
    enemyTurnStart(data: string, cb: () => void);
    unitMoveAnim(data: { unit: IUnit, path: number[][] }, cb: () => void);
    unitBattleAnim(data: any, cb: () => void);
    paint(data: any, cb: () => void);
}