import type {
  CardColor,
  BaSyou,
  CardCategory,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
  GameEventOnManualEvent,
} from "./basic";
import {
  TargetTypeBaSyou,
  TargetTypeBoolean,
  TargetTypeCard,
  TargetTypeCardCategory,
  TargetTypeCardColor,
  TargetTypeCardRole,
  TargetTypeGameEventOnManualEvent,
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
  | "in"
  | "hasToken"
  | ConditionCompareBooleanOperator;

type ConditionCompareNumberOperator =
  | "<="
  | "<"
  | ">"
  | ">="
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

type ConditionCompareCardColor = {
  id: "ConditionCompareCardColor";
  value: [
    TargetTypeCardColor,
    ConditionCompareStringOperator,
    TargetTypeCardColor
  ];
};

type ConditionCompareGameEventOnManualEvent = {
  id: "ConditionCompareGameEventOnManualEvent",
  value: [
    TargetTypeGameEventOnManualEvent,
    ConditionCompareBooleanOperator,
    TargetTypeGameEventOnManualEvent
  ]
}

export type Condition =
  | ConditionCompareNumber
  | ConditionCompareString
  | ConditionCompareBoolean
  | ConditionCompareRole
  | ConditionCompareCard
  | ConditionCompareCardCategory
  | ConditionCompareCardColor
  | ConditionComparePlayer
  | ConditionCompareBaSyou
  | ConditionCompareGameEventOnManualEvent
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
