import type {
  TargetTypeCard,
  TargetTypeCardColor,
  TargetTypeBaSyou,
  TargetTypeYesNo,
  TargetTypeThisCard,
} from ".";
import type { BlockPayload } from "./blockPayload";
import type { GameEffect } from "../gameContext";

type ActionRoll = {
  id: "ActionRoll";
  cards: string | TargetTypeCard | TargetTypeThisCard;
};

type ActionReroll = {
  id: "ActionReroll";
  cards: string | TargetTypeCard | TargetTypeThisCard;
};

type ActionSetTarget = {
  id: "ActionSetTarget";
  source: string;
  target: string;
};

type ActionConsumeG = {
  id: "ActionConsumeG";
  cards: string | TargetTypeCard;
  color?: string | TargetTypeCardColor;
};

// 廃棄
type ActionDrop = {
  id: "ActionDrop";
  cards: string | TargetTypeCard | TargetTypeThisCard;
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionDestroy = {
  id: "ActionDestroy";
  cards: string | TargetTypeCard | TargetTypeThisCard;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  baSyou: string | TargetTypeBaSyou;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  flag: string;
  value: boolean;
};

type ActionSetFace = {
  id: "ActionSetFace";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  faceDown: string | TargetTypeYesNo;
};

type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
  cardA: string | TargetTypeCard | TargetTypeThisCard;
  cardB: string | TargetTypeCard | TargetTypeThisCard;
};

type ActionUnitDamage = {
  id: "ActionUnitDamage";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  value: string;
};

type ActionAddBlock = {
  id: "ActionAddBlock";
  type: "立即" | "堆疊";
  block: BlockPayload;
};

type ActionAddEffect = {
  id: "ActionAddEffect";
  effectID?: string;
  effect: GameEffect;
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
  | ActionUnitDamage
  | ActionAddBlock
  | ActionAddEffect;
