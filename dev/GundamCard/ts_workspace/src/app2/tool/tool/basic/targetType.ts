import { BaSyou, CardColor } from "./basic";
import { GameContext } from "./gameContext";
import { BlockPayload } from "./blockPayload";

export type TargetTypePlayer = {
  id: "プレーヤー";
  playerID: (string | null)[];
};

export type TargetTypeCard = {
  id: "カード";
  cardID: (string | null)[];
  tipID?: string[];
};

export type TargetTypeBaSyou = {
  id: "場所";
  baSyou: BaSyou | null;
};

export type TargetTypeCardColor = {
  id: "カードの色";
  color: CardColor | null;
};

export type TargetTypeNumber = {
  id: "TargetTypeNumber";
  number: number | null;
};

export type TargetTypeYesNo = {
  id: "TargetTypeYesNo";
  boolean: boolean | null;
};

export type TargetTypeCustom = {
  id: "TargetTypeCustom";
  scriptString: string;
};

export type TargetTypeThisCard = {
  id: "このカード";
};

export type TargetTypeThisCardTotalCost = {
  id: "このカードの合計国力";
};

type Damage = any;

type TargetTypeDamage = {
  id: "TargetTypeDamage";
  damage: Damage;
};

export type TargetType =
  | TargetTypePlayer
  | TargetTypeCard
  | TargetTypeCardColor
  | TargetTypeBaSyou
  | TargetTypeThisCard
  | TargetTypeThisCardTotalCost
  | TargetTypeNumber
  | TargetTypeYesNo
  | TargetTypeDamage
  | TargetTypeCustom;

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;
