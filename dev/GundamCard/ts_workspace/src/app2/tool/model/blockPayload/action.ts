import type { CardColor, BaSyou, FlagKeyword } from "../basic";

type ActionRoll = {
  id: "ActionRoll";
};

type ActionSetTarget = {
  id: "ActionSetTarget";
  targetID: string;
};

type ActionConsumeG = {
  id: "ActionConsumeG";
  color: CardColor | null;
  count: number;
};

// 廃棄
type ActionDrop = {
  id: "ActionDrop";
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  toPosition: BaSyou;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  flag: FlagKeyword;
  value: boolean;
};

type ActionSetFace = {
  id: "ActionSetFace";
  faceDown: boolean;
};

export type Action =
  | ActionRoll
  | ActionConsumeG
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionSetFace
  | ActionSetFlag;
