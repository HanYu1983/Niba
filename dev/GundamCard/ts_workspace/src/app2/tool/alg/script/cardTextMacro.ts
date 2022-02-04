export { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
export { getRequireMacro } from "./getRequireMacro";
export { getConditionMacro } from "./getConditionMacro";

import { BlockPayload } from "../../tool/basic/blockPayload";
import { BlockPayloadCauseDestroy } from "../../tool/basic/blockPayload";

export function createDestroyEffect(
  cause: BlockPayloadCauseDestroy
): BlockPayload {
  // 產生廢棄自己的效果
  return {
    cause: cause,
    feedback: [
      {
        id: "FeedbackAction",
        action: [
          {
            id: "ActionMoveCardToPosition",
            cards: {
              id: "カード",
              value: { path: [{ id: "このカード" }] },
            },
            baSyou: {
              id: "場所",
              value: [{ id: "RelatedBaSyou", value: ["持ち主", "捨て山"] }],
            },
          },
        ],
      },
    ],
  };
}
