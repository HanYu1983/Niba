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

type ConditionCompareBooleanOperator = "==" | "!=";

type ConditionCompareStringOperator =
  | "hasToken"
  | ConditionCompareBooleanOperator;

type ConditionCompareNumberOperator =
  | "<="
  | "<"
  | ">"
  | ">="
  | "in"
  | ConditionCompareStringOperator;

type ConditionCompareCardOperator = "交戦中" | ConditionCompareBooleanOperator;

type ConditionCompareNumber = {
  id: "ConditionCompareNumber";
  value: [TargetTypeNumber, ConditionCompareNumberOperator, TargetTypeNumber];
};

type ConditionCompareString = {
  id: "ConditionCompareString";
  value: [TargetTypeString, ConditionCompareStringOperator, TargetTypeString];
};

type ConditionCompareBoolean = {
  id: "ConditionCompareBoolean";
  value: [
    TargetTypeBoolean,
    ConditionCompareBooleanOperator,
    TargetTypeBoolean
  ];
};

type ConditionCompareRole = {
  id: "ConditionCompareRole";
  value: [
    TargetTypeCardRole,
    ConditionCompareStringOperator,
    TargetTypeCardRole
  ];
};

type ConditionCompareCard = {
  id: "ConditionCompareCard";
  value: [TargetTypeCard, ConditionCompareCardOperator, TargetTypeCard];
};

type ConditionComparePlayer = {
  id: "ConditionComparePlayer";
  value: [TargetTypePlayer, ConditionCompareStringOperator, TargetTypePlayer];
};

type ConditionCompareBaSyou = {
  id: "ConditionCompareBaSyou";
  value: [TargetTypeBaSyou, ConditionCompareStringOperator, TargetTypeBaSyou];
};

type ConditionCompareCardCategory = {
  id: "ConditionCompareCardCategory";
  value: [
    TargetTypeCardCategory,
    ConditionCompareStringOperator,
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
