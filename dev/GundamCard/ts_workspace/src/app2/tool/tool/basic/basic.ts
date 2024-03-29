import { BlockPayload } from "./blockPayload";
import { DestroyReason } from "./gameContext";

export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

export type UnitPropertyKeyword = "攻撃力" | "防御力";

export type BattleAreaKeyword = "宇宙エリア" | "地球エリア";

// 場
export type BaKeyword = "戦闘エリア（左）" | "戦闘エリア（右）" | "配備エリア";

// 場所
export type BaSyouKeyword =
  | "本国"
  | "捨て山"
  | "Gゾーン"
  | "ジャンクヤード"
  | "手札"
  | "ハンガー"
  | "取り除かれたカード"
  | "プレイされているカード"
  | BaKeyword;

export function isBa(k: BaSyouKeyword): boolean {
  switch (k) {
    case "戦闘エリア（右）":
    case "戦闘エリア（左）":
    case "配備エリア":
      return true;
    default:
      return false;
  }
}

export type AbsoluteBaSyou = {
  id: "AbsoluteBaSyou";
  value: [PlayerID, BaSyouKeyword];
};

export type RelatedBaSyou = {
  id: "RelatedBaSyou";
  value: [RelatedPlayerSideKeyword | "持ち主", BaSyouKeyword];
};

export type BaSyou = AbsoluteBaSyou | RelatedBaSyou;

export function getBaSyouID(baSyou: AbsoluteBaSyou) {
  return JSON.stringify(baSyou.value);
}

export function getBaSyou(id: string): AbsoluteBaSyou {
  return {
    id: "AbsoluteBaSyou",
    value: JSON.parse(id),
  };
}

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

export type Phase =
  | ["リロールフェイズ", "フェイズ開始"]
  | ["リロールフェイズ", "規定の効果"]
  | ["リロールフェイズ", "フリータイミング"]
  | ["リロールフェイズ", "フェイズ終了"]
  | ["ドローフェイズ", "フェイズ開始"]
  | ["ドローフェイズ", "規定の効果"]
  | ["ドローフェイズ", "フリータイミング"]
  | ["ドローフェイズ", "フェイズ終了"]
  | ["配備フェイズ", "フェイズ開始"]
  | ["配備フェイズ", "フリータイミング"]
  | ["配備フェイズ", "フェイズ終了"]
  | ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]
  | ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "防御ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "防御ステップ", "規定の効果"]
  | ["戦闘フェイズ", "防御ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "防御ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "帰還ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "帰還ステップ", "規定の効果"]
  | ["戦闘フェイズ", "帰還ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "帰還ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "ターン終了時", "ダメージリセット"]
  | ["戦闘フェイズ", "ターン終了時", "効果解決"]
  | ["戦闘フェイズ", "ターン終了時", "手札調整"]
  | ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"];

export type Timing = [number, Phase];

export type RelatedPlayerSideKeyword = "自軍" | "敵軍";

export type SiYouTiming =
  | [
      | "常時"
      | "ドローフェイズ"
      | "リロールフェイズ"
      | "配備フェイズ"
      | "戦闘フェイズ"
      | "攻撃ステップ"
      | "防御ステップ"
      | "ダメージ判定ステップ"
      | "帰還ステップ"
    ]
  | [
      RelatedPlayerSideKeyword,
      (
        | "ターン"
        | "ドローフェイズ"
        | "リロールフェイズ"
        | "配備フェイズ"
        | "戦闘フェイズ"
        | "攻撃ステップ"
        | "防御ステップ"
        | "ダメージ判定ステップ"
        | "帰還ステップ"
      )
    ];

// export const TIMING_CHART = ((): Timing[] => {
//   const phaseSeq: Phase[] = [
//     ["リロールフェイズ", "フェイズ開始"],
//     ["リロールフェイズ", "規定の効果"],
//     ["リロールフェイズ", "フリータイミング"],
//     ["リロールフェイズ", "フェイズ終了"],
//     ["ドローフェイズ", "フェイズ開始"],
//     ["ドローフェイズ", "フリータイミング"],
//     ["ドローフェイズ", "規定の効果"],
//     ["ドローフェイズ", "フリータイミング"],
//     ["ドローフェイズ", "フェイズ終了"],
//     ["配備フェイズ", "フェイズ開始"],
//     ["配備フェイズ", "フリータイミング"],
//     ["配備フェイズ", "フェイズ終了"],
//     ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"],
//     ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "攻撃ステップ", "規定の効果"],
//     ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"],
//     ["戦闘フェイズ", "防御ステップ", "ステップ開始"],
//     ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "防御ステップ", "規定の効果"],
//     ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "防御ステップ", "ステップ終了"],
//     ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
//     ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"],
//     ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"],
//     ["戦闘フェイズ", "帰還ステップ", "ステップ開始"],
//     ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
//     ["戦闘フェイズ", "帰還ステップ", "規定の効果"],
//     ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
//     // 帰還ステップ 沒有 ステップ終了
//     // ["戦闘フェイズ", "帰還ステップ", "ステップ終了"],
//     ["戦闘フェイズ", "ターン終了時", "ダメージリセット"],
//     ["戦闘フェイズ", "ターン終了時", "効果解決"],
//     ["戦闘フェイズ", "ターン終了時", "手札調整"],
//     ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"],
//   ];
//   return phaseSeq.map((phase, i): Timing => {
//     return [i, phase];
//   });
// })();

export const TIMING_CHART: Timing[] = [
  [0, ["リロールフェイズ", "フェイズ開始"]],
  [1, ["リロールフェイズ", "規定の効果"]],
  [2, ["リロールフェイズ", "フリータイミング"]],
  [3, ["リロールフェイズ", "フェイズ終了"]],
  [4, ["ドローフェイズ", "フェイズ開始"]],
  [5, ["ドローフェイズ", "フリータイミング"]],
  [6, ["ドローフェイズ", "規定の効果"]],
  [7, ["ドローフェイズ", "フリータイミング"]],
  [8, ["ドローフェイズ", "フェイズ終了"]],
  [9, ["配備フェイズ", "フェイズ開始"]],
  [10, ["配備フェイズ", "フリータイミング"]],
  [11, ["配備フェイズ", "フェイズ終了"]],
  [12, ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"]],
  [13, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]],
  [14, ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]],
  [15, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]],
  [16, ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"]],
  [17, ["戦闘フェイズ", "防御ステップ", "ステップ開始"]],
  [18, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]],
  [19, ["戦闘フェイズ", "防御ステップ", "規定の効果"]],
  [20, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]],
  [21, ["戦闘フェイズ", "防御ステップ", "ステップ終了"]],
  [22, ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"]],
  [23, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
  [24, ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"]],
  [25, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]],
  [26, ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"]],
  [27, ["戦闘フェイズ", "帰還ステップ", "ステップ開始"]],
  [28, ["戦闘フェイズ", "帰還ステップ", "フリータイミング"]],
  [29, ["戦闘フェイズ", "帰還ステップ", "規定の効果"]],
  [30, ["戦闘フェイズ", "帰還ステップ", "フリータイミング"]],
  [31, ["戦闘フェイズ", "ターン終了時", "ダメージリセット"]],
  [32, ["戦闘フェイズ", "ターン終了時", "効果解決"]],
  [33, ["戦闘フェイズ", "ターン終了時", "手札調整"]],
  [34, ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"]],
];

export function getNextTiming(timing: Timing): Timing {
  const nextId = (timing[0] + 1) % TIMING_CHART.length;
  return TIMING_CHART[nextId];
}

export function isCanPlayCardInPhase(phase: Phase): boolean {
  switch (phase[0]) {
    case "ドローフェイズ":
      return phase[1] == "フリータイミング";
    case "リロールフェイズ":
    case "配備フェイズ":
      return phase[1] == "フリータイミング" || phase[1] == "フェイズ開始";
    case "戦闘フェイズ":
      return phase[2] == "フリータイミング" || phase[2] == "ステップ開始";
  }
}

export type BattleBonus = [number, number, number];

type GameEvent1 = {
  id: "GameEventOnTiming";
  timing: Timing;
};

type GameEvent2 = {
  id: "カット終了時";
  effects: BlockPayload[];
};

export type GameEventWithCard = {
  id: string;
  cardID: string;
};

type GameEvent3 = {
  id:
    | "場に出た場合"
    | "プレイされて場に出た場合"
    | "プレイされて場にセットされた場合"
    | "戦闘ダメージを受けた場合"
    | "コインがx個以上になった場合"
    | "「改装」の効果で廃棄される場合"
    | "「改装」の効果で場に出た場合";
  cardID: string;
};

type GameEvent4 = {
  id: "破壊された場合";
  cardID: string;
  destroyReason: DestroyReason;
};

type GameEvent5 = {
  id: "プレイした場合" | "解決直後";
  cardID: string;
  cardTextID: string;
};

type GameEvent6 = {
  id: "「ゲイン」の効果で戦闘修正を得る場合";
  cardID: string;
  battleBonus: BattleBonus;
};

export type GameEvent =
  | GameEvent1
  | GameEvent2
  | GameEvent3
  | GameEvent4
  | GameEvent5
  | GameEvent6;

export type TokuSyuKouKa =
  | ["高機動"]
  | ["速攻"]
  | ["サイコミュ", number]
  | ["強襲"]
  | ["範囲兵器", number]
  | ["ゲイン"]
  | ["改装", string]
  | ["共有", string]
  | ["供給"]
  | ["クロスウェポン", string]
  | ["PS装甲"]
  | ["クイック"]
  | ["戦闘配備"]
  | ["ステイ"]
  | ["1枚制限"];

// 常駐技能在每次尋問中重新計算，卡片必須在場中
// 恆常技能在每次尋問中重新計算，無論卡片在哪
// 起動技能在每次事件發生時，就將符合的起動技能加入block
export type CardTextZiDouKaTa = {
  id: "自動型";
  description: string;
  category: "常駐" | "起動" | "恒常";
  block: BlockPayload;
  fixed?: boolean;
  cardTextStateID?: string;
};

export type CardTextSiYouKaTa = {
  id: "使用型";
  description: string;
  timing: SiYouTiming;
  block: BlockPayload;
  fixed?: boolean;
  cardTextStateID?: string;
};

export type CardTextToKuSyuKata = {
  id: "特殊型";
  description: TokuSyuKouKa;
  texts: (CardTextZiDouKaTa | CardTextSiYouKaTa)[];
  cardTextStateID?: string;
};

export type CardTextZiDouKaTa2 = {
  id: "恒常";
  description: string;
  texts: (CardTextZiDouKaTa | CardTextSiYouKaTa)[];
  cardTextStateID?: string;
};

export type CardTextCustomIDBattleBonus = {
  id: "CardTextCustomIDBattleBonus";
  battleBonus: BattleBonus;
  cardTextStateID?: string;
};

export type CardTextCustomID = CardTextCustomIDBattleBonus;

export type CardTextCustom = {
  id: "CardTextCustom";
  description: string;
  customID: CardTextCustomID;
  cardTextStateID?: string;
};

export type CardText =
  | CardTextZiDouKaTa
  | CardTextSiYouKaTa
  | CardTextToKuSyuKata
  | CardTextZiDouKaTa2
  | CardTextCustom;

export const DEFAULT_CARD_TEXT_SIYOU_KATA: CardTextSiYouKaTa = {
  id: "使用型",
  timing: ["自軍", "配備フェイズ"],
  description: "",
  block: {},
};

export const DEFAULT_CARD_TEXT_ZIDOU_KATA: CardTextZiDouKaTa = {
  id: "自動型",
  category: "起動",
  description: "",
  block: {},
};

export type FlagKeyword = "破壊" | "プレイされたカード";

export function getOpponentPlayerID(playerID: PlayerID): PlayerID {
  return playerID == PlayerA ? PlayerB : PlayerA;
}

export type AttackSpeed = 1 | 2;

type CoinBattleBonus = {
  id: "CoinBattleBonus";
  battleBonus: BattleBonus;
};

type CoinCoin = {
  id: "CoinCoin";
};
export type Coin = CoinCoin | CoinBattleBonus;
