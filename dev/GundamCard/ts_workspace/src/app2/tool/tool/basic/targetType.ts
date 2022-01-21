import {
  BaSyou,
  BattleBonus,
  CardCategory,
  CardColor,
  GameEvent,
  GameEventOnAfterEffect,
  GameEventOnManualEvent,
  PlayerID,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
} from "./basic";
import { GameContext, GameEffect } from "./gameContext";
import { BlockPayload } from "./blockPayload";

export type TargetTypeBase = {
  responsePlayer?: TargetTypePlayer,
}

export type TargetTypeGameEventOnAfterEffect = {
  id: "「効果」解決時",
  value: GameEventOnAfterEffect[] | string | { path: [{ id: "觸發這個事件的「効果」" }] }
} & TargetTypeBase

export type TargetTypeGameEventOnManualEvent = {
  id: "手動事件發生時",
  value: GameEventOnManualEvent[] | string | { path: [{ id: "觸發這個事件的手動事件" }] }
} & TargetTypeBase

export type TargetTypeBattleBonus = {
  id: "戦闘修正",
  value: BattleBonus[] | string | { path: [TargetTypeGameEventOnManualEvent, "の「ゲイン」の「効果」の戦闘修正"] }
} & TargetTypeBase

export type TargetTypeCard = {
  id: "カード";
  value: string[] | string | { path: [{ id: "このカード" }] | [TargetTypeGameEventOnAfterEffect, "的「カード」"] };
  tipID?: string[];
  valueLengthInclude?: number[];
} & TargetTypeBase

export type TargetTypePlayer = {
  id: "プレーヤー";
  value:
  | PlayerID[]
  | string
  | {
    path: [{ id: RelatedPlayerSideKeyword }] | [TargetTypeCard, "的「コントローラー」" | "的「持ち主」"];
  };
} & TargetTypeBase

export type TargetTypeRef = {
  id: "參照";
  value: string;
} & TargetTypeBase

export type TargetTypeNumber = {
  id: "數字";
  value:
  | number[]
  | string
  | {
    path:
    | [TargetTypeCard, "的「攻撃力」" | "的「防御力」" | "的「合計国力」"]
    | [TargetTypePlayer, "的「合計国力」" | "的「改装」的「合計国力」"]
    | [TargetTypeRef, "的陣列長度"];
  };
} & TargetTypeBase

export type TargetTypeString = {
  id: "字串";
  value:
  | string[]
  | string
  | { path: [TargetTypeCard, "的「名称」" | "的「特徴」"] };
} & TargetTypeBase

export type TargetTypeBoolean = {
  id: "布林";
  value:
  | boolean[]
  | string
  | {
    path:
    | [TargetTypeCard, "在「交戦中」？" | "是「セットカード」？"]
    | [TargetTypeCard, "存在旗標？", string]
    | [TargetTypeCard, "是直立的？"];
  };
} & TargetTypeBase

export type TargetTypeBaSyou = {
  id: "場所";
  value: BaSyou[] | string | { path: [TargetTypeCard, "的「場所」"] };
} & TargetTypeBase

export type TargetTypeCardColor = {
  id: "カードの色";
  value: CardColor[] | string | { path: [TargetTypeCard, "的「色」"] };
} & TargetTypeBase;

export type TargetTypeCardCategory = {
  id: "カードの種類";
  value: CardCategory[] | string | { path: [TargetTypeCard, "的「種類」"] };
} & TargetTypeBase

export type TargetTypeCardRole = {
  id: "「カード」的角色";
  triggerGameEvent?: GameEventOnManualEvent;
  value: CardCategory[] | string | { path: [TargetTypeCard, "的角色" | "當成横置裝彈G時的角色"] };
} & TargetTypeBase

export type TargetTypeCustom = {
  id: "腳本";
  value: string;
} & TargetTypeBase

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  value: Damage | string | null;
} & TargetTypeBase

export type TargetType =
  | TargetTypeRef
  | TargetTypeCard
  | TargetTypePlayer
  | TargetTypeNumber
  | TargetTypeString
  | TargetTypeBoolean
  | TargetTypeCardColor
  | TargetTypeCardCategory
  | TargetTypeCardRole
  | TargetTypeBaSyou
  | TargetTypeDamage
  | TargetTypeCustom
  | TargetTypeBattleBonus
  | TargetTypeGameEventOnAfterEffect
  | TargetTypeGameEventOnManualEvent;

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;
