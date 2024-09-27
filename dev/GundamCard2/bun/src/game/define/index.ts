export type RelatedPlayerSideKeyword = "自軍" | "敵軍";
export type UnitPropertyKeyword = "攻撃力" | "防御力";
export type FlagKeyword = "破壊" | "プレイされたカード";
export type AttackSpeed = 1 | 2;

import * as BaSyou from "./BaSyou"
import * as BattlePoint from "./BattlePoint"
import * as CardPrototype from "./CardPrototype"
import * as Effect from "./Effect"
import * as GameEvent from "./GameEvent"
import * as GlobalEffect from "./GlobalEffect"
import * as PlayerID from "./PlayerID"
import * as Target from "./Tip"
import * as CardText from "./CardText"
import * as Timing from "./Timing"
import * as Coin from "./Coin"
import * as Tip from "./Tip"
import * as ItemState from "./ItemState"
import * as GameError from "./GameError"
import * as Card from "./Card"
import * as CommandEffectTip from "./CommandEffectTip"
export const DefineFn = {
    ...BaSyou,
    ...BattlePoint,
    ...CardPrototype,
    ...Effect,
    ...GameEvent,
    ...GlobalEffect,
    ...PlayerID,
    ...Target,
    ...CardText,
    ...Timing,
    ...Coin,
    ...Tip,
    ...ItemState,
    ...GameError,
    ...Card,
    ...CommandEffectTip
}