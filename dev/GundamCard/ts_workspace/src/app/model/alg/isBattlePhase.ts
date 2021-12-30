import { Context, Action, Payment, Effect } from "../../types";
export const isBattlePhase = (ctx: Context) => {
  switch (ctx.gameState.phase[0]) {
    case "attack":
    case "damage":
    case "guard":
      return true;
    default:
      return false;
  }
};
