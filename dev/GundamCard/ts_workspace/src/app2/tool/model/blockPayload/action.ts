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
  color?: CardColor;
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

type ActionDestroy = {
  id: "ActionDestroy";
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

type ActionCreateArrayFromSourceTargetID = {
  id: "ActionCreateArrayFromSourceTargetID";
  sourceTargetID: string[];
  targetID: string;
};

type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
};

type Value = any;

type ActionUnitDamage = {
  id: "ActionUnitDamage";
  value: Value;
};

export type Action =
  | ActionRoll
  | ActionConsumeG
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionDestroy
  | ActionSetFace
  | ActionSetFlag
  | ActionCreateArrayFromSourceTargetID
  | ActionOKiKaeRu
  | ActionUnitDamage;
