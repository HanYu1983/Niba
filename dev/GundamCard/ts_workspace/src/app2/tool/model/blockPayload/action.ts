import type { CardColor, BaSyou, FlagKeyword } from "../basic";

type ActionRoll = {
  id: "ActionRoll";
  cards: string;
};

type ActionReroll = {
  id: "ActionReroll";
  cards: string;
};

type ActionSetTarget = {
  id: "ActionSetTarget";
  source: string;
  target: string;
};

type ActionConsumeG = {
  id: "ActionConsumeG";
  cards: string;
  color?: string;
};

// 廃棄
type ActionDrop = {
  id: "ActionDrop";
  cards: string;
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionDestroy = {
  id: "ActionDestroy";
  cards: string;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  cards: string;
  baSyou: string;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  cards: string;
  flag: string;
  value: boolean;
};

type ActionSetFace = {
  id: "ActionSetFace";
  cards: string;
  faceDown: string;
};

type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
  cardA: string;
  cardB: string;
};

type ActionUnitDamage = {
  id: "ActionUnitDamage";
  cards: string;
  value: string;
};

export type Action =
  | ActionRoll
  | ActionReroll
  | ActionConsumeG
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionDestroy
  | ActionSetFace
  | ActionSetFlag
  | ActionOKiKaeRu
  | ActionUnitDamage;
