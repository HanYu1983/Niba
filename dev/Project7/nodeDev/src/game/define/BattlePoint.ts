export type BattlePoint = ["*" | number, "*" | number, "*" | number];

function getValue(v: "*" | number): number {
    if (v == "*") {
        return 0
    }
    return v
}

function add([x, y, z]: BattlePoint, [x2, y2, z2]: BattlePoint): BattlePoint {
    return [
        getValue(x) + getValue(x2),
        getValue(y) + getValue(y2),
        getValue(z) + getValue(z2)
    ]
}

export const BattlePointFn = {
    add: add,
    getValue: getValue,
}