import { BattleBonus } from "../tool/basic/basic";

type GameEventOnMenualEventCustomID1 = {
  id: "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合";
};

type GameEventOnMenualEventCustomID2 = {
  id: "「ゲイン」の効果で戦闘修正を得た場合";
  bonus: BattleBonus;
};

type GameEventOnMenualEventCustomID3 = {
  id: "プレイされて場に出た場合";
  cardID: string;
};

type GameEventOnMenualEventCustomID4 = {
  id: "合計国力－xしてプレイできる";
  x: number;
  cardID: string;
};

export type GameEventOnManualEventCustomID = 0;
