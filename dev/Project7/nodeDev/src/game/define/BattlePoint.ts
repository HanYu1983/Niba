export type BattlePoint = ["*" | number, "*" | number, "*" | number];

export function getSingleValue(v: "*" | number): number {
    if (v == "*") {
        return 0
    }
    return v
}

export function addBattleBonus([x, y, z]: BattlePoint, [x2, y2, z2]: BattlePoint): BattlePoint {
    return [
        getSingleValue(x) + getSingleValue(x2),
        getSingleValue(y) + getSingleValue(y2),
        getSingleValue(z) + getSingleValue(z2)
    ]
}