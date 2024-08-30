export type TBattleBonus = ["*" | number, "*" | number, "*" | number];

export function getSingleValue(v: "*" | number): number {
    if (v == "*") {
        return 0
    }
    return v
}

export function add([x, y, z]: TBattleBonus, [x2, y2, z2]: TBattleBonus): TBattleBonus {
    return [
        getSingleValue(x) + getSingleValue(x2),
        getSingleValue(y) + getSingleValue(y2),
        getSingleValue(z) + getSingleValue(z2)
    ]
}

export default {
    getSingleValue,
    add
}