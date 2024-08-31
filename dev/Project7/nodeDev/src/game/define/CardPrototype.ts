import { BattleAreaKeyword } from "./BaSyou";
import { BattlePoint } from "./BattlePoint";
import { Text } from "./Text";

// card
export type CardCategory =
  | "ユニット"
  | "キャラクター"
  | "コマンド"
  | "オペレーション"
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

export type CardPrototype = {
    title: string;
    characteristic: string[];
    color: CardColor;
    category: CardCategory;
    rollCost: (CardColor | null)[];
    battlePoint: BattlePoint;
    battleArea: BattleAreaKeyword[];
    texts: Text[];
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
    title: "名稱未定義",
    characteristic: [],
    color: "白",
    category: "ユニット",
    rollCost: [],
    battlePoint: [0, 0, 0],
    battleArea: ["地球エリア", "宇宙エリア"],
    texts: [],
};