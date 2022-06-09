
type WillEatInfo = {
    x: number,
    y: number,
    fromChessId: number,
    toChessId: number
}

export type AIModel = {
    // 我方所有可攻擊到的格子
    posCanAttackByMe: WillEatInfo[]
    // 敵方所有可攻擊到的格子
    posCanAttackByEnemy: WillEatInfo[]
    // 移動到這裡後下一步就能吃到子
    moveToPosCanAttackByMe: WillEatInfo[]
}