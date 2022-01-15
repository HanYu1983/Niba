import {
  BaSyou,
  CardCategory,
  CardColor,
  PlayerID,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
} from "./basic";
import { GameContext } from "./gameContext";
import { BlockPayload } from "./blockPayload";

export type TargetTypeCard = {
  id: "カード";
  value: string[] | string | { path: [{ id: "このカード" }] };
};

export type TargetTypePlayer = {
  id: "プレーヤー";
  value:
    | PlayerID[]
    | string
    | {
        path: [TargetTypeCard, "的「コントローラー」" | "的「持ち主」"];
      };
};

export type TargetTypeRef = {
  id: "參照";
  value: string;
};

export type TargetTypeNumber = {
  id: "數字";
  value:
    | number[]
    | string
    | {
        path:
          | [TargetTypeCard, "的「攻撃力」" | "的「防御力」" | "的「合計国力」"]
          | [TargetTypeRef, "陣列長度"];
      };
};

export type TargetTypeString = {
  id: "字串";
  value: string[] | string | { path: [TargetTypeCard, "的「名称」"] };
};

export type TargetTypeBoolean = {
  id: "布林";
  value: boolean[] | string | { path: [TargetTypeCard, "在「交戦中」？"] };
};

export type TargetTypeBaSyou = {
  id: "場所";
  value: BaSyou[] | string | { path: [TargetTypeCard, "的「場所」"] };
};

export type TargetTypeCardColor = {
  id: "カードの色";
  value: CardColor[] | string | { path: [TargetTypeCard, "的「色」"] };
};

export type TargetTypeCardCategory = {
  id: "カードの種類";
  value: CardCategory[] | string | { path: [TargetTypeCard, "的「種類」"] };
};

export type TargetTypeCardRole = {
  id: "「カード」的角色";
  value: CardCategory[] | string | { path: [TargetTypeCard, "的角色"] };
};

export type TargetTypeCustom = {
  id: "腳本";
  value: string;
};

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  value: Damage | string | null;
};

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
  | TargetTypeCustom;

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;
