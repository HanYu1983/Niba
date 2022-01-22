import { BattleBonus } from "../tool/basic/basic"

export type GameEventMenualEventCustomID1 = {
    id: "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合"
}

export type GameEventMenualEventCustomID2 = {
    id: "「ゲイン」の効果で戦闘修正を得た場合",
    bonus: BattleBonus
}

export type GameEventManualEventCustomID = GameEventMenualEventCustomID1 | GameEventMenualEventCustomID2
