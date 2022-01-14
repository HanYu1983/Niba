import {
  BaSyou,
  CardColor,
  RelatedPlayerSideKeyword,
  UnitPropertyKeyword,
} from "./basic";
import { GameContext } from "./gameContext";
import { BlockPayload } from "./blockPayload";

export type TargetTypeCard = {
  id: "カード";
  cardID: (string | null)[] | "このカード";
};

export type TargetTypePlayer = {
  id: "プレーヤー";
  playerID: string | null;
};

export type TargetTypeNumber = {
  id: "TargetTypeNumber";
  source?: string;
  value: number | "攻撃力" | "防御力" | "合計国力" | null;
};

export type TargetTypeString = {
  id: "TargetTypeString";
  source?: string;
  value: (string | null)[] | "名称";
};

export type TargetTypeBoolean = {
  id: "TargetTypeBoolean";
  type?: any;
  source?: string;
  value: boolean | RelatedPlayerSideKeyword | null;
};

export type TargetTypeBaSyou = {
  id: "場所";
  baSyou: BaSyou | null;
};

export type TargetTypeCardColor = {
  id: "カードの色";
  color: CardColor | null;
};

export type TargetTypeCustom = {
  id: "TargetTypeCustom";
  scriptString: string;
};

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  damage: Damage;
};

export type TargetType =
  | TargetTypeCard
  | TargetTypePlayer
  | TargetTypeNumber
  | TargetTypeString
  | TargetTypeBoolean
  | TargetTypeCardColor
  | TargetTypeBaSyou
  | TargetTypeDamage
  | TargetTypeCustom;

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;
