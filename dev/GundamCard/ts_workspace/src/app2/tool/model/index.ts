import type {
  CardColor,
  BaSyou,
  CardCategory,
  TextCategory,
  SiYouTiming,
  TargetType,
} from "./basic";
import { BlockPayload, Feedback, Require, RequireTarget } from "./blockPayload";

// ロール
export type CostRoll = {
  id: "CostRoll";
};

export type CostNumber = {
  id: "CostNumber";
  count: number;
  cardColor: CardColor | null;
  // P45
  unlimited: boolean;
};

export type CostAnd = {
  id: "CostAnd";
  and: Cost[];
};

export type CostOr = {
  id: "CostOr";
  and: Cost[];
};

export type Cost = CostAnd | CostOr | CostNumber | CostRoll;

// ==========
