import type {
  TargetTypeCard,
  TargetTypeCardColor,
  TargetTypeBaSyou,
  TargetTypeBoolean,
  TargetTypeCardTextState,
  TargetTypeString,
} from "./targetType";
import type { BlockPayload } from "./blockPayload";
import type { CardPrototype, CardState, GameEffect } from "./gameContext";
import { CardText } from "./basic";

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

// type ActionConsumeG = {
//   id: "ActionConsumeG";
//   cards: TargetTypeCard;
//   color?: TargetTypeCardColor;
// };

// 廃棄
type ActionDrop = {
  id: "ActionDrop";
  cards: TargetTypeCard;
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionDestroy = {
  id: "ActionDestroy";
  cards: TargetTypeCard;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  cards: TargetTypeCard;
  baSyou: TargetTypeBaSyou;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

type ActionAddFlag = {
  id: "ActionAddFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

type ActionDeleteFlag = {
  id: "ActionDeleteFlag";
  cards: TargetTypeCard;
  flag: TargetTypeString;
};

type ActionSetFace = {
  id: "ActionSetFace";
  cards: TargetTypeCard;
  faceDown: TargetTypeBoolean;
};

type ActionOKiKaeRu = {
  id: "ActionOKiKaeRu";
  cardA: TargetTypeCard;
  cardB: TargetTypeCard;
};

type ActionUnitDamage = {
  id: "ActionUnitDamage";
  cards: TargetTypeCard;
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
  cards: TargetTypeCard;
  cardState: CardState;
};

type ActionDeleteGlobalCardText = {
  id: "ActionDeleteGlobalCardText";
  cardTextStateID: string;
};

type ActionAddCardText = {
  id: "ActionAddCardText";
  cards: TargetTypeCard;
  cardTextState: TargetTypeCardTextState;
};

type ActionDeleteCardText = {
  id: "ActionDeleteCardText";
  cards: TargetTypeCard;
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
  //| ActionConsumeG
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
  | ActionCreateChip;
