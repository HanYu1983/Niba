import { log } from "../../../../tool/logger";
import { getCustomFunction } from "../../../../tool/helper";
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

export type TargetTypeThisCard = {
  id: "このカード";
};

export type TargetTypeYesNo = {
  id: "TargetTypeYesNo";
  boolean: boolean | null;
};

export type TargetTypeCustom = {
  id: "TargetTypeCustom";
  scriptString: string;
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
  | TargetTypeDamage
  | TargetTypeCustom;

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;

export function getTargetType(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  target: string | TargetType
): TargetType {
  log("getTargetType", target);
  const targetTypeAfterProcess = (() => {
    if (typeof target == "string") {
      return targets[target];
    }
    return target;
  })();
  switch (targetTypeAfterProcess.id) {
    case "このカード":
      if (blockPayload.cause?.cardID == null) {
        throw new Error("[getTarget] このカード not found");
      }
      return { id: "カード", cardID: [blockPayload.cause.cardID] };
    case "TargetTypeCustom": {
      const func: TargetTypeCustomFunctionType = getCustomFunction(
        targetTypeAfterProcess.scriptString
      );
      return func(ctx, blockPayload);
    }
    default:
      return targetTypeAfterProcess;
  }
}
