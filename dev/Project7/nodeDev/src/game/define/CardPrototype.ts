import { BattleAreaKeyword } from "./BaSyou";
import { BattlePoint, BattlePointFn } from "./BattlePoint";
import { Text } from "./Text";

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
  | "デュアル";

export type RollCostColor = CardColor | null;

export type CardPrototype = {
  id: string;
  title: string;
  characteristic: string;
  color: CardColor;
  category: CardCategory;
  rollCost: RollCostColor[];
  battlePoint: BattlePoint;
  battleArea: BattleAreaKeyword[];
  texts: Text[];
  commandText?: Text;
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  id: "",
  title: "名稱未定義",
  characteristic: "",
  color: "白",
  category: "ユニット",
  rollCost: [],
  battlePoint: BattlePointFn.getAllStar(),
  battleArea: ["地球エリア", "宇宙エリア"],
  texts: [],
};