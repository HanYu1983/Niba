import { BattleAreaKeyword } from "./BaSyou";
import { BattlePoint, BattlePointFn } from "./BattlePoint";
import { CardText } from "./CardText";

// card
export type CardCategory =
  | "ユニット"
  | "キャラクター"
  | "コマンド"
  | "オペレーション"
  | "オペレーション(ユニット)"
  | "ACE"
  | "グラフィック";

export const CardCategoryFn = {
  createAll(): CardCategory[] {
    return [
      "ユニット",
      "キャラクター",
      "コマンド",
      "オペレーション",
      "オペレーション(ユニット)",
      "ACE",
      "グラフィック"
    ];
  },
  createRemaining(values: CardCategory[]): CardCategory[] {
    return CardCategoryFn.createAll().filter(category => !values.includes(category));
  }
}

export type CardRole = "未指定" | CardCategory;

export type CardColor =
  | "緑"
  | "茶"
  | "青"
  | "白"
  | "紫"
  | "黒"
  | "赤"
  //| "デュアル"
  ;
export const CardColorFn = {
  getAll(): CardColor[] {
    return ["緑", "茶", "青", "白", "紫", "黒", "赤"];
  }
}

export type GSignProperty =
  | "08"
  | "UC"
  | "SEED"
  | "W"
  | "閃光のハサウェイ"
  | "CCA"

export type GSign = [CardColor[], GSignProperty]

export type RollCostColor = CardColor | null;
export type CardPrototypeRollCost = "X" | RollCostColor[];
export type CardPrototypeTotalCost = "X" | number

export type CardPrototype = {
  id?: string;
  title?: string;
  characteristic?: string;
  color?: CardColor,
  gsign?: GSign,
  category?: CardCategory;
  totalCost?: CardPrototypeTotalCost;
  rollCost?: CardPrototypeRollCost;
  battlePoint?: BattlePoint;
  battleArea?: BattleAreaKeyword[];
  texts?: CardText[];
  commandText?: CardText;
  originCardId?: string;
  description?: string;
  isCross?: boolean,
  rarity?: string,
  __ignoreAutoTexts?: boolean
};

