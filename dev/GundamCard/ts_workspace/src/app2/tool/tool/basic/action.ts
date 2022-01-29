import type {
  TargetTypeCard,
  TargetTypeCardColor,
  TargetTypeBaSyou,
  TargetTypeBoolean,
  TargetTypeCardTextState,
  TargetTypeString,
} from "./targetType";
import type { BlockPayload } from "./blockPayload";
import type {
  CardPrototype,
  CardState,
  GameEffect,
  GlobalCardState,
} from "./gameContext";
import { CardText, GameEvent } from "./basic";

type ActionRoll = {
  id: "ActionRoll";
  cards: TargetTypeCard;
};

type ActionReroll = {
  id: "ActionReroll";
  cards: TargetTypeCard;
};

type ActionSetTarget = {
  id: "ActionSetTarget";
  source: string;
  target: string;
};

// 廃棄
export type ActionDrop = {
  id: "ActionDrop";
  cards: TargetTypeCard;
};

export type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

export type ActionDestroy = {
  id: "ActionDestroy";
  cards: TargetTypeCard;
};

export type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  cards: TargetTypeCard;
  baSyou: TargetTypeBaSyou;
};

export type ActionSetFlag = {
  id: "ActionSetFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

export type ActionAddFlag = {
  id: "ActionAddFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

export type ActionDeleteFlag = {
  id: "ActionDeleteFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

export type ActionSetFace = {
  id: "ActionSetFace";
  cards: TargetTypeCard;
  faceDown: TargetTypeBoolean;
};

export type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
  cardA: TargetTypeCard;
  cardB: TargetTypeCard;
};

export type ActionUnitDamage = {
  id: "ActionUnitDamage";
  cards: TargetTypeCard;
  value: string;
};

export type ActionAddBlock = {
  id: "ActionAddBlock";
  type: "立即" | "堆疊";
  block: BlockPayload;
};

// 加入全局效果
export type ActionAddEffect = {
  id: "ActionAddEffect";
  effectID?: string;
  effect: GameEffect;
};

export type ActionAddGlobalCardText = {
  id: "ActionAddGlobalCardText";
  cards: TargetTypeCard;
  cardState: GlobalCardState;
};

export type ActionDeleteGlobalCardText = {
  id: "ActionDeleteGlobalCardText";
  cardTextStateID: string;
};

export type ActionAddCardText = {
  id: "ActionAddCardText";
  cards: TargetTypeCard;
  cardTextState: TargetTypeCardTextState;
};

export type ActionDeleteCardText = {
  id: "ActionDeleteCardText";
  cards: TargetTypeCard;
  cardTextStateID: string;
};

export type ActionRuleDraw = {
  id: "ActionRuleDraw";
};

export type ActionRegisterChip = {
  id: "ActionRegisterChip";
  protoID: string;
  prototype: CardPrototype;
};

export type ActionCreateChip = {
  id: "ActionCreateChip";
  protoID: string;
  createChipTarget: any;
};

export type ActionJsonfp = {
  id: "ActionJsonfp";
  program: any;
};

export type ActionSetSetCard = {
  id: "ActionSetSetCard";
  cards: TargetTypeCard;
  distCard: TargetTypeCard;
};

export type ActionTriggerGameEvent = {
  id: "ActionTriggerGameEvent";
  gameEvent: GameEvent;
};

export type Action =
  | ActionRoll
  | ActionReroll
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionDestroy
  | ActionSetFace
  | ActionSetFlag
  | ActionAddFlag
  | ActionDeleteFlag
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
  | ActionCreateChip
  | ActionJsonfp
  | ActionSetSetCard
  | ActionTriggerGameEvent;
