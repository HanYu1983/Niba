import type {
  CardColor,
  BaSyou,
  CardCategory,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
} from "./basic";
import {
  TargetTypeBoolean,
  TargetTypeNumber,
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

type ConditionCardPropertyCompareOperator = "<=" | "<" | "==" | ">" | ">=";

type ConditionCardPropertyCompare = {
  id: "ConditionCardPropertyCompare";
  value: [
    TargetTypeNumber,
    ConditionCardPropertyCompareOperator,
    TargetTypeNumber
  ];
};

type ConditionCardPropertyCompareString = {
  id: "ConditionCardPropertyCompareString";
  value: [
    TargetTypeString,
    ConditionCardPropertyCompareOperator,
    TargetTypeString
  ];
};

type ConditionCardPropertyCompareBoolean = {
  id: "ConditionCardPropertyCompareBoolean";
  value: [
    TargetTypeBoolean,
    ConditionCardPropertyCompareOperator,
    TargetTypeBoolean
  ];
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
  | ConditionCardPropertyCompare
  | ConditionCardPropertyCompareString
  | ConditionCardPropertyCompareBoolean
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
