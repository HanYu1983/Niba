import { isBa } from "../tool/basic/basic";
import { GameContext } from "../tool/basic/gameContext";
import { BlockPayload } from "../tool/basic/blockPayload";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { TargetTypeCardCustom } from "../tool/basic/targetTypeCardCustom";

export function getTargetTypeCardCustom(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  target: TargetType,
  customID: TargetTypeCardCustom
): TargetTypeCard {
  switch (customID.id) {
    case "交戦中ではない、全てのユニット": {
      const allUnitCards = Object.keys(ctx.gameState.table.cardStack)
        .filter((baSyouID) => {
          const [_, kw] = JSON.parse(baSyouID);
          return isBa(kw);
        })
        .filter((baSyouID) => {
          return ctx.gameState.isBattle[baSyouID] != true;
        })
        .flatMap((baSyouID) => ctx.gameState.table.cardStack[baSyouID]);
      return {
        id: "カード",
        value: allUnitCards.map((card) => card.id),
      };
    }
  }
}
