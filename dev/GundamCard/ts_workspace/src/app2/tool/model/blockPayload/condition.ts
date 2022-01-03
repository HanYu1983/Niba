import type {
  CardColor,
  BaSyou,
  CardCategory,
  RelatedPlayerSideKeyword,
} from "../basic";

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
};

type ConditionCardHasSetCard = {
  id: "ConditionCardHasSetCard";
};

type ConditionCardIsPlayerSide = {
  id: "ConditionCardIsPlayerSide";
  playerSide: RelatedPlayerSideKeyword;
};

type ConditionCardContainFlag = {
  id: "ConditionCardContainFlag";
  flag: string;
};

type ConditionGameEventOnEnterStage = {
  id: "ConditionGameEventOnEnterStage";
  wherePosition: BaSyou[];
};

type ConditionTargetType = {
  id: "ConditionTargetType";
  target: "プレーヤー" | "カード" | "場所";
};

type ConditionCardIsRole = {
  id: "ConditionCardIsRole";
  role: CardCategory;
};

export type Condition =
  | ConditionGameEventOnEnterStage
  | ConditionCardOnBaSyou
  | ConditionCardOnColor
  | ConditionCardOnCategory
  | ConditionCardIsSetCard
  | ConditionCardHasSetCard
  | ConditionCardIsPlayerSide
  | ConditionCardContainFlag
  | ConditionCardIsRole
  | ConditionTargetType
  | ConditionNot
  | ConditionOr
  | ConditionAnd;
