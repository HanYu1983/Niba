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
        path: [TargetTypeCard, "Controller" | "Owner"];
      };
};

export type TargetTypeNumber = {
  id: "TargetTypeNumber";
  value:
    | number[]
    | string
    | { path: [TargetTypeCard, "攻撃力" | "防御力" | "合計国力"] };
};

export type TargetTypeString = {
  id: "TargetTypeString";
  value: string[] | string | { path: [TargetTypeCard, "名称"] };
};

export type TargetTypeBoolean = {
  id: "TargetTypeBoolean";
  value: boolean[] | string | { path: [TargetTypeCard, "交戦中"] };
};

export type TargetTypeBaSyou = {
  id: "場所";
  value: BaSyou[] | string | { path: [TargetTypeCard, "の場所"] };
};

export type TargetTypeCardColor = {
  id: "カードの色";
  value: CardColor[] | string | { path: [TargetTypeCard, "の色"] };
};

export type TargetTypeCardCategory = {
  id: "TargetTypeCardCategory";
  value: CardCategory[] | string | { path: [TargetTypeCard, "の種類"] };
};

export type TargetTypeCardRole = {
  id: "TargetTypeCardRole";
  value: CardCategory[] | string | { path: [TargetTypeCard, "的角色"] };
};

export type TargetTypeCustom = {
  id: "TargetTypeCustom";
  value: string;
};

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  value: Damage | string | null;
};

export type TargetType =
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
