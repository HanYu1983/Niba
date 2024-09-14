export type RelatedPlayerSideKeyword = "自軍" | "敵軍";
export type UnitPropertyKeyword = "攻撃力" | "防御力";
export type FlagKeyword = "破壊" | "プレイされたカード";
export type AttackSpeed = 1 | 2;

// type CoinBattleBonus = {
//   id: "CoinBattleBonus";
//   battleBonus: BattleBonus;
// };

// type CoinCoin = {
//   id: "CoinCoin";
// };
// export type Coin = CoinCoin | CoinBattleBonus;

import * as BaSyou from "./BaSyou"
import * as BattlePoint from "./BattlePoint"
import * as CardPrototype from "./CardPrototype"
import * as Effect from "./Effect"
import * as Event from "./Event"
import * as GlobalEffect from "./GlobalEffect"
import * as PlayerID from "./PlayerID"
import * as Target from "./Target"
import * as Text from "./Text"
import * as TextID from "./TextID"
import * as Timing from "./Timing"

export const DefineFn = {
    ...BaSyou,
    ...BattlePoint,
    ...CardPrototype,
    ...Effect,
    ...Event,
    ...GlobalEffect,
    ...PlayerID,
    ...Target,
    ...Text,
    ...TextID,
    ...Timing,
}