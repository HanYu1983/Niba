import { BlockPayload } from "../blockPayload";

export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

export type UnitPropertyKeyword = "攻撃力" | "防御力";

// 場
export type BaKeyword = "戦闘エリア" | "配備エリア";

// 場所
export type BaSyouKeyword =
  | null // プレイされたカード
  | "本国"
  | "捨て山"
  | "Gゾーン"
  | "ジャンクヤード"
  | "手札"
  | "ハンガー"
  | "取り除かれたカード"
  | BaKeyword;

export type AbsoluteBaSyou = {
  id: "AbsoluteBaSyou";
  value: [PlayerID, BaSyouKeyword];
};

export type RelatedBaSyou = {
  id: "RelatedBaSyou";
  value: ["自軍" | "持ち主", BaSyouKeyword];
};

export type BaSyou = AbsoluteBaSyou | RelatedBaSyou;

export function getBaShouID(baSyou: AbsoluteBaSyou) {
  return JSON.stringify(baSyou.value);
}

export function getBaShou(id: string): AbsoluteBaSyou {
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

export const TIMING_CHART = ((): Timing[] => {
  const phaseSeq: Phase[] = [
    ["リロールフェイズ", "フェイズ開始"],
    ["リロールフェイズ", "規定の効果"],
    ["リロールフェイズ", "フリータイミング"],
    ["リロールフェイズ", "フェイズ終了"],
    ["ドローフェイズ", "フェイズ開始"],
    ["ドローフェイズ", "フリータイミング"],
    ["ドローフェイズ", "規定の効果"],
    ["ドローフェイズ", "フリータイミング"],
    ["ドローフェイズ", "フェイズ終了"],
    ["配備フェイズ", "フェイズ開始"],
    ["配備フェイズ", "フリータイミング"],
    ["配備フェイズ", "フェイズ終了"],
    ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"],
    ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
    ["戦闘フェイズ", "攻撃ステップ", "規定の効果"],
    ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
    ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"],
    ["戦闘フェイズ", "防御ステップ", "ステップ開始"],
    ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
    ["戦闘フェイズ", "防御ステップ", "規定の効果"],
    ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
    ["戦闘フェイズ", "防御ステップ", "ステップ終了"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"],
    ["戦闘フェイズ", "帰還ステップ", "ステップ開始"],
    ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
    ["戦闘フェイズ", "帰還ステップ", "規定の効果"],
    ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
    ["戦闘フェイズ", "帰還ステップ", "ステップ終了"],
    ["戦闘フェイズ", "ターン終了時", "ダメージリセット"],
    ["戦闘フェイズ", "ターン終了時", "効果解決"],
    ["戦闘フェイズ", "ターン終了時", "手札調整"],
    ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"],
  ];
  return phaseSeq.map((phase, i): Timing => {
    return [i, phase];
  });
})();

export function nextTiming(timing: Timing): Timing {
  const nextId = timing[0] + (1 % TIMING_CHART.length);
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

export type GameEvent = any;

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
type TextCategoryZiDouKaTa = {
  id: "自動型";
  text?: string;
  category: "常駐" | "恒常" | ["起動", GameEvent];
  block?: BlockPayload;
};

type TextCategorySiYouKaTa = {
  id: "使用型";
  text?: string;
  timing?: SiYouTiming;
  block?: BlockPayload;
};

type TextCategoryToKuSyuKata = {
  id: "特殊型";
  text: TokuSyuKouKa;
  texts?: (TextCategoryZiDouKaTa | TextCategorySiYouKaTa)[];
};

export type TextCategory =
  | TextCategoryZiDouKaTa
  | TextCategorySiYouKaTa
  | TextCategoryToKuSyuKata;

export type FlagKeyword = "破壊" | "プレイされたカード" | "once";

export type TargetTypePlayer = {
  id: "プレーヤー";
  playerID: (string | null)[];
};

export type TargetTypeCard = {
  id: "カード";
  cardID: (string | null)[];
};

export type TargetTypeBaSyou = {
  id: "場所";
  baSyou: BaSyou | null;
};

export type TargetTypeCardColor = {
  id: "カードの色";
  color: CardColor | null;
};

export type TargetTypeThisCard = {
  id: "このカード";
};

export type TargetTypeYesNo = {
  id: "TargetTypeYesNo";
  boolean: boolean | null;
};

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  damage: Damage | null;
};

export type TargetType =
  | TargetTypePlayer
  | TargetTypeCard
  | TargetTypeCardColor
  | TargetTypeBaSyou
  | TargetTypeThisCard
  | TargetTypeYesNo
  | TargetTypeDamage;
