import type {
  CardColor,
  BaSyou,
  CardCategory,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
} from "./basic";
import {
  TargetTypeBaSyou,
  TargetTypeBoolean,
  TargetTypeCard,
  TargetTypeCardCategory,
  TargetTypeCardRole,
  TargetTypeNumber,
  TargetTypePlayer,
  TargetTypeString,
} from "./targetType";

type ConditionOr = {
  id: "ConditionOr";
  or: Condition[];
};

type ConditionAnd = {
  id: "ConditionAnd";
  and: Condition[];
};

type ConditionNot = {
  id: "ConditionNot";
  not: Condition;
};

type ConditionCardOnBaSyou = {
  id: "ConditionCardOnBaSyou";
  source: string;
  baSyou: BaSyou;
};

type ConditionCardOnColor = {
  id: "ConditionCardOnColor";
  source: string;
  color: CardColor;
};

type ConditionCardOnCategory = {
  id: "ConditionCardOnCategory";
  source: string;
  category: CardCategory;
};

type ConditionCardIsSetCard = {
  id: "ConditionCardIsSetCard";
  source: string;
};

type ConditionCardHasSetCard = {
  id: "ConditionCardHasSetCard";
  source: string;
};

type ConditionCardIsPlayerSide = {
  id: "ConditionCardIsPlayerSide";
  source: string;
  playerSide: RelatedPlayerSideKeyword;
};

type ConditionCardContainFlag = {
  id: "ConditionCardContainFlag";
  source: string;
  flag: string;
};

type ConditionTargetType = {
  id: "ConditionTargetType";
  target: "プレーヤー" | "カード" | "場所";
};

type ConditionCardIsRole = {
  id: "ConditionCardIsRole";
  source: string;
  role: CardCategory;
};

type ConditionCardHasTokuTyou = {
  id: "ConditionCardHasTokuTyou";
  source: string;
  value: string;
};

type ConditionCardIsBattle = {
  id: "ConditionCardIsBattle";
  source: string;
};

type ConditionCompareOperator = "<=" | "<" | "==" | ">" | ">=" | "!=" | "in";

type ConditionCompareNumber = {
  id: "ConditionCompareNumber";
  value: [TargetTypeNumber, ConditionCompareOperator, TargetTypeNumber];
};

type ConditionCompareString = {
  id: "ConditionCompareString";
  value: [TargetTypeString, ConditionCompareOperator, TargetTypeString];
};

type ConditionCompareBoolean = {
  id: "ConditionCompareBoolean";
  value: [TargetTypeBoolean, ConditionCompareOperator, TargetTypeBoolean];
};

type ConditionCompareRole = {
  id: "ConditionCompareRole";
  value: [TargetTypeCardRole, ConditionCompareOperator, TargetTypeCardRole];
};

type ConditionCompareCardOperator = "交戦中" | ConditionCompareOperator;

type ConditionCompareCard = {
  id: "ConditionCompareCard";
  value: [TargetTypeCard, ConditionCompareCardOperator, TargetTypeCard];
};

type ConditionComparePlayer = {
  id: "ConditionComparePlayer";
  value: [TargetTypePlayer, ConditionCompareOperator, TargetTypePlayer];
};

type ConditionCompareBaSyou = {
  id: "ConditionCompareBaSyou";
  value: [TargetTypeBaSyou, ConditionCompareOperator, TargetTypeBaSyou];
};

export type Condition =
  | ConditionCardOnBaSyou
  | ConditionCardOnColor
  | ConditionCardOnCategory
  | ConditionCardIsSetCard
  | ConditionCardHasSetCard
  | ConditionCardIsPlayerSide
  | ConditionCardContainFlag
  | ConditionCardIsRole
  | ConditionTargetType
  | ConditionCardHasTokuTyou
  | ConditionCardIsBattle
  | ConditionCompareNumber
  | ConditionCompareString
  | ConditionCompareBoolean
  | ConditionCompareRole
  | ConditionCompareCard
  | ConditionComparePlayer
  | ConditionCompareBaSyou
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
