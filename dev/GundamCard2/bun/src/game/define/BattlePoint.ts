import { BattleBonus } from "./CardText";

export type BattlePoint = ["*" | number, "*" | number, "*" | number];

function getValue(v: "*" | number): number {
    if (v == "*") {
        return 0
    }
    return v
}

function add([x, y, z]: BattlePoint, [x2, y2, z2]: BattlePoint): BattlePoint {
    return [
        Math.max(0, getValue(x) + getValue(x2)),
        Math.max(0, getValue(y) + getValue(y2)),
        Math.max(0, getValue(z) + getValue(z2))
    ]
}

export const BattlePointFn = {
    getAllStar: () => ["*", "*", "*"] as BattlePoint,
    add: add,
    getValue: getValue,
    toBattleBonus(v: BattlePoint): BattleBonus {
        return [getValue(v[0]), getValue(v[1]), getValue(v[2])]
    },
    eq(l: BattlePoint, r: BattlePoint): boolean {
        return JSON.stringify(l) == JSON.stringify(r)
    }
}