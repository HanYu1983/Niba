import type { CardColor, BaSyou, CardCategory } from "../basic";

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
  baSyou: BaSyou;
};

type ConditionCardOnColor = {
  id: "ConditionCardOnColor";
  color: CardColor;
};

type ConditionCardOnCategory = {
  id: "ConditionCardOnCategory";
  category: CardCategory;
};

type ConditionCardIsSetCard = {
  id: "ConditionCardIsSetCard";
  is: boolean;
};

type ConditionCardIsOpponentCard = {
  id: "ConditionCardIsOpponentCard";
  is: boolean;
};

type ConditionCardContainFlag = {
  id: "ConditionCardContainFlag";
  flag: string;
  is: boolean;
};

type ConditionGameEventOnEnterStage = {
  id: "ConditionGameEventOnEnterStage";
  wherePosition: BaSyou[];
};

type ConditionTargetType = {
  id: "ConditionTargetType";
  target: "プレーヤー" | "カード" | "場所";
};

export type Condition =
  | ConditionGameEventOnEnterStage
  | ConditionCardOnBaSyou
  | ConditionCardOnColor
  | ConditionCardOnCategory
  | ConditionCardIsSetCard
  | ConditionCardIsOpponentCard
  | ConditionCardContainFlag
  | ConditionTargetType
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
