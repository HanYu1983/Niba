import { BattleAreaKeyword } from "./BaSyou";
import { BattlePoint, BattlePointFn } from "./BattlePoint";
import { CardText } from "./CardText";

// card
export type CardCategory =
  | "ユニット"
  | "キャラクター"
  | "コマンド"
  | "オペレーション"
  | "オペレーション(unit)"
  | "ACE"
  | "グラフィック";

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

export type GSign = [CardColor, GSignProperty]

export type RollCostColor = CardColor | null;

export type CardPrototype = {
  id?: string;
  title?: string;
  characteristic?: string;
  color?: CardColor;
  gsign?: GSign,
  category?: CardCategory;
  rollCost?: RollCostColor[];
  battlePoint?: BattlePoint;
  battleArea?: BattleAreaKeyword[];
  texts?: CardText[];
  commandText?: CardText;
};

