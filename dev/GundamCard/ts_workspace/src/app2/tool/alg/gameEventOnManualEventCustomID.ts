import { BattleBonus } from "../tool/basic/basic";

export type GameEventOnMenualEventCustomID1 = {
  id: "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合";
};

export type GameEventOnMenualEventCustomID2 = {
  id: "「ゲイン」の効果で戦闘修正を得た場合";
  bonus: BattleBonus;
};

export type GameEventOnMenualEventCustomID3 = {
  id: "プレイされて場に出た場合";
  cardID: string;
};

export type GameEventOnManualEventCustomID =
  | GameEventOnMenualEventCustomID1
  | GameEventOnMenualEventCustomID2
  | GameEventOnMenualEventCustomID3;
