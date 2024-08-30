export type RelatedPlayerSideKeyword = "自軍" | "敵軍";
export type UnitPropertyKeyword = "攻撃力" | "防御力";

// player
export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

// flag

export type FlagKeyword = "破壊" | "プレイされたカード";

export function getOpponentPlayerID(playerID: PlayerID): PlayerID {
  return playerID == PlayerA ? PlayerB : PlayerA;
}

export type AttackSpeed = 1 | 2;

// type CoinBattleBonus = {
//   id: "CoinBattleBonus";
//   battleBonus: BattleBonus;
// };

// type CoinCoin = {
//   id: "CoinCoin";
// };
// export type Coin = CoinCoin | CoinBattleBonus;