import { getCardPosition } from "../../../../tool/table";
import { CardColor, getBaShou } from "../basic";
import {
  BlockPayload,
  Feedback,
  Require,
  RequireCustom,
  RequireTarget,
} from "../blockPayload";
import { Block } from "../scriptContext/blockContext";
import { GameContext } from "./gameContext";

export type RequireCustomID1 = {
  id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合";
  color: CardColor;
  number: number;
};

export type RequireCustomID2 = {
  id: "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる";
  x: string;
};

export type RequireCustomID3 = {
  id: "このカードが自軍手札にある状態";
  x: string;
};

export type RequireCustomID =
  | RequireCustomID1
  | RequireCustomID2
  | RequireCustomID3;

export function doRequireCustom(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireCustom,
  requireCustomID: RequireCustomID,
  varCtxID: string
): GameContext {
  switch (requireCustomID.id) {
    case "{color}のGサインを持つ自軍Gが{number}枚以上ある場合": {
      const cardID = blockPayload.cause?.cardID;
      if (cardID == null) {
        throw new Error("card id not found");
      }
      const [_, cardPosition] = getCardPosition(ctx.gameState.table, cardID);
      if (cardPosition == null) {
        throw new Error("cardPosition not found");
      }
      const {
        value: [playerID],
      } = getBaShou(cardPosition);
      console.log(playerID);
      return ctx;
    }
    case "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる": {
      return ctx;
    }
  }
  return ctx;
}
