import { TargetType } from "../basic";
import { BlockPayload } from "../blockPayload";
import { Block } from "../scriptContext/blockContext";
import { Condition } from "../blockPayload/condition";
import { GameContext } from "./gameContext";
import { getCard } from "../../../../tool/table";
import { getCardScript } from "../../script";
import { askRowData } from "../../../../tool/data";

export function doConditionTarget(
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  condition: Condition
): string | null {
  switch (condition.id) {
    case "ConditionNot": {
      const result = doConditionTarget(
        gameCtx,
        blockPayload,
        targets,
        condition.not
      );
      const isOk = result == null;
      const notResult = isOk == false;
      return notResult ? null : `子項目必須為否`;
    }
    case "ConditionAnd": {
      const results = condition.and.map((cond) =>
        doConditionTarget(gameCtx, blockPayload, targets, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasFalse = reasons.length > 0;
      if (hasFalse) {
        return reasons.join(".");
      }
      return null;
    }
    case "ConditionOr": {
      const results = condition.or.map((cond) =>
        doConditionTarget(gameCtx, blockPayload, targets, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return null;
      }
      return `不符合其中1項: ${reasons.join(".")}`;
    }
    case "ConditionTargetType":
      {
        // switch (condition.target) {
        //   case "カード": {
        //     if (target.id != "カード" && target.id != "このカード") {
        //       return "必須是カード";
        //     }
        //   }
        //   default:
        //     if (target.id != condition.target) {
        //       return `必須是${condition.target}`;
        //     }
        // }
      }
      break;
    case "ConditionCardOnCategory": {
      // if (target.id != "カード") {
      //   return "必須是カード";
      // }
      // const card = getCard(gameCtx.gameState.table, target.cardID);
      // if (card == null) {
      //   return `target cardID(${target.cardID}) not found`;
      // }

      // const rowData = askRowData(card.protoID);
      // switch (condition.category) {
      //   case "ユニット":
      //     if (rowData.category != "UNIT") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "コマンド":
      //     if (rowData.category != "COMMAND") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "キャラクター":
      //     if (rowData.category != "CHARACTER") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "オペレーション":
      //     if (rowData.category != "OPERATION") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "グラフィック":
      //     if (rowData.category != "GRAPHIC") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      // }
      return null;
    }
  }
  return null;
}
