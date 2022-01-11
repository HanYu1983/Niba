import type {
  TargetTypeCard,
  TargetTypeCardColor,
  TargetTypeBaSyou,
  TargetTypeYesNo,
  TargetTypeThisCard,
} from "./targetType";
import type { BlockPayload } from "./blockPayload";
import type { GameEffect } from "./gameContext";
import { CardText } from "./basic";

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

// 加入全局效果
type ActionAddEffect = {
  id: "ActionAddEffect";
  effectID?: string;
  effect: GameEffect;
};

type ActionAddGlobalCardText = {
  id: "ActionAddGlobalCardText";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  cardText: CardText;
  cardTextStateID?: string;
};

type ActionDeleteGlobalCardText = {
  id: "ActionDeleteGlobalCardText";
  cardTextStateID: string;
};

type ActionAddCardText = {
  id: "ActionAddCardText";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  cardText: CardText;
  cardTextStateID?: string;
};

type ActionDeleteCardText = {
  id: "ActionDeleteCardText";
  cards: string | TargetTypeCard | TargetTypeThisCard;
  cardTextStateID: string;
};

type ActionRuleDraw = {
  id: "ActionRuleDraw";
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
  | ActionAddEffect
  | ActionAddCardText
  | ActionDeleteCardText
  | ActionAddGlobalCardText
  | ActionDeleteGlobalCardText
  | ActionRuleDraw;
