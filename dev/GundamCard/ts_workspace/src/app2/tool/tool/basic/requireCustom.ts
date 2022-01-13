import { CardColor } from "./basic";

export type RequireCustomID1 = {
  id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合";
  color: CardColor;
  number: number;
};

export type RequireCustomID2 = {
  id: "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる";
  x: string;
};

export type RequireCustomID3 = {
  id: "このカードが自軍手札にある状態";
  x: string;
};

export type RequireCustomID4 = {
  id: "有快速就常時，不然就是自軍配置";
};

export type RequireCustomID5 = {
  id: "Play時的合計國力";
};

export type RequireCustomID =
  | RequireCustomID1
  | RequireCustomID2
  | RequireCustomID3
  | RequireCustomID4
  | RequireCustomID5;
