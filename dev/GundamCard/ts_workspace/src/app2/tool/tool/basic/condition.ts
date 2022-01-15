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

type ConditionCompareOperator =
  | "<="
  | "<"
  | "=="
  | ">"
  | ">="
  | "!="
  | "in"
  | "hasToken";

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

type ConditionCompareCardCategory = {
  id: "ConditionCompareCardCategory";
  value: [
    TargetTypeCardCategory,
    ConditionCompareOperator,
    TargetTypeCardCategory
  ];
};

export type Condition =
  | ConditionCompareNumber
  | ConditionCompareString
  | ConditionCompareBoolean
  | ConditionCompareRole
  | ConditionCompareCard
  | ConditionCompareCardCategory
  | ConditionComparePlayer
  | ConditionCompareBaSyou
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
