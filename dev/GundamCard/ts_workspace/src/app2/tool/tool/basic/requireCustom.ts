import { CardColor, RelatedPlayerSideKeyword } from "./basic";

type RequireCustomID1 = {
  id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合";
  color: CardColor;
  number: number;
};

type RequireCustomID2 = {
  id: "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる";
  x: string;
};

type RequireCustomID3 = {
  id: "このカードが自軍手札にある状態";
  x: string;
};

type RequireCustomID4 = {
  id: "有快速就常時，不然就是自軍配置";
};

type RequireCustomID5 = {
  id: "Play時的合計國力";
};

type RequireCustomID6 = {
  id: "交戦中のx軍ユニットがいる場合";
  x: RelatedPlayerSideKeyword;
};

export type RequireCustomID =
  | RequireCustomID1
  | RequireCustomID2
  | RequireCustomID3
  //| RequireCustomID4
  | RequireCustomID5
  | RequireCustomID6;
