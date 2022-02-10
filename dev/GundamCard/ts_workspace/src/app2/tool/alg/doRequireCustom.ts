import { getCardPosition } from "../../../tool/table";
import {
  AbsoluteBaSyou,
  BaSyouKeyword,
  CardColor,
  getBaShou,
  getBaShouID,
  getOpponentPlayerID,
} from "../tool/basic/basic";
import {
  BlockPayload,
  Feedback,
  Require,
  RequireCustom,
  RequireTarget,
} from "../tool/basic/blockPayload";
import { GameContext, getBlockOwner } from "../tool/basic/gameContext";
import { getCardController } from "../tool/basic/handleCard";
import { RequireCustomID } from "../tool/basic/requireCustom";
import { getCardIterator, getCardState } from "./helper";

export function doRequireCustom(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireCustom,
  requireCustomID: RequireCustomID,
  varCtxID: string
): GameContext {
  switch (requireCustomID.id) {
    case "交戦中のx軍ユニットがいる場合": {
      if (blockPayload.cause?.playerID == null) {
        throw new Error("playerID not found");
      }
      const myID = (() => {
        switch (requireCustomID.x) {
          case "自軍":
            return blockPayload.cause.playerID;
          case "敵軍":
            return getOpponentPlayerID(blockPayload.cause.playerID);
        }
      })();
      const battleAreaKW: BaSyouKeyword[] = [
        "戦闘エリア（右）",
        "戦闘エリア（左）",
      ];
      const unitInBattleArea = battleAreaKW
        .map((kw): AbsoluteBaSyou => {
          return { id: "AbsoluteBaSyou", value: [myID, kw] };
        })
        .filter((baSyou) => {
          const baSyouID = getBaShouID(baSyou);
          const isBattle = ctx.gameState.isBattle[baSyouID];
          if (isBattle != true) {
            return false;
          }
          const hasUnit = ctx.gameState.table.cardStack[baSyouID]?.length > 0;
          if (hasUnit != true) {
            return false;
          }
          return true;
        });
      if (unitInBattleArea.length == 0) {
        throw new Error(JSON.stringify(requireCustomID));
      }
    }
    case "{color}のGサインを持つ自軍Gが{number}枚以上ある場合": {
      return ctx;
    }
    case "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる": {
      return ctx;
    }
    case "Play時的合計國力":
      // const cardID = (() => {
      //   if (blockPayload.cause == null) {
      //     throw new Error("must has cause");
      //   }
      //   switch (blockPayload.cause.id) {
      //     case "BlockPayloadCauseGameEvent":
      //     case "BlockPayloadCauseUpdateCommand":
      //     case "BlockPayloadCauseUpdateEffect":
      //       if (blockPayload.cause.cardID == null) {
      //         throw new Error("[getTarget] このカード not found");
      //       }
      //       return blockPayload.cause.cardID;
      //     default:
      //       throw new Error("not support cause:" + blockPayload.cause.id);
      //   }
      // })();
      // const [_, cardState] = getCardState(ctx, cardID);
      // const controller = getCardController(ctx, cardID);
      // const [_2, iterator] = getCardIterator(ctx);
      // const gCount = iterator.filter((info) => {
      //   return (
      //     info.baSyou.value[0] == controller &&
      //     info.baSyou.value[1] == "Gゾーン"
      //   );
      // }).length;
      // const requireGCount = cardState.prototype.rollCost.length;
      // if (gCount < requireGCount) {
      //   throw new Error(
      //     `合計國力不足. 你的G數量為${gCount}, 但你的合計國力需求為${requireGCount}`
      //   );
      // }
      return ctx;
  }
  return ctx;
}
