import type {
  TargetTypeCard,
  TargetTypeCardColor,
  TargetTypeBaSyou,
  TargetTypeBoolean,
} from "./targetType";
import type { BlockPayload } from "./blockPayload";
import type { CardPrototype, GameEffect } from "./gameContext";
import { CardText } from "./basic";

type ActionRoll = {
  id: "ActionRoll";
  cards: string | TargetTypeCard;
};

type ActionReroll = {
  id: "ActionReroll";
  cards: string | TargetTypeCard;
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
  cards: string | TargetTypeCard;
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionDestroy = {
  id: "ActionDestroy";
  cards: string | TargetTypeCard;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  cards: string | TargetTypeCard;
  baSyou: string | TargetTypeBaSyou;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  cards: string | TargetTypeCard;
  flag: string;
  value: boolean;
};

type ActionSetFace = {
  id: "ActionSetFace";
  cards: string | TargetTypeCard;
  faceDown: string | TargetTypeBoolean;
};

type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
  cardA: string | TargetTypeCard;
  cardB: string | TargetTypeCard;
};

type ActionUnitDamage = {
  id: "ActionUnitDamage";
  cards: string | TargetTypeCard;
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
  cards: string | TargetTypeCard;
  cardText: CardText;
  cardTextStateID?: string;
};

type ActionDeleteGlobalCardText = {
  id: "ActionDeleteGlobalCardText";
  cardTextStateID: string;
};

type ActionAddCardText = {
  id: "ActionAddCardText";
  cards: string | TargetTypeCard;
  cardText: CardText;
  cardTextStateID?: string;
};

type ActionDeleteCardText = {
  id: "ActionDeleteCardText";
  cards: string | TargetTypeCard;
  cardTextStateID: string;
};

type ActionRuleDraw = {
  id: "ActionRuleDraw";
};

type ActionRegisterChip = {
  id: "ActionRegisterChip";
  protoID: string;
  prototype: CardPrototype;
};

type ActionCreateChip = {
  id: "ActionCreateChip";
  protoID: string;
  createChipTarget: any;
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
  | ActionRuleDraw
  | ActionRegisterChip
  | ActionCreateChip;
