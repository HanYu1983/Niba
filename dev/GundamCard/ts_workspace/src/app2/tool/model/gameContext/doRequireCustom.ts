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
  id: "このカードと同じエリアに、「特徴:x」を持つ自軍キャラがいる";
  x: string;
};

export type RequireCustomID = RequireCustomID1;

export function doRequireCustom(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: RequireCustom,
  requireCustomID: RequireCustomID,
  varCtxID: string
): GameContext {
  switch (requireCustomID.id) {
    case "このカードと同じエリアに、「特徴:x」を持つ自軍キャラがいる": {
      throw new Error("NT not found");
    }
  }
  return gameCtx;
}
