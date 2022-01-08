import {
  BlockPayload,
  Feedback,
  Require,
  RequireCustom,
  RequireTarget,
} from "../blockPayload";
import { Block } from "../scriptContext/blockContext";
import { GameContext } from "./gameContext";

export type RequireCustomFunction = (
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  varCtxID: string
) => GameContext;

export function getRequireCustomFunctionString(
  fn: RequireCustomFunction
): string {
  // 手動加入匿名方法的function name
  // 無法按下列這樣做，因為編譯器會把匿名方法的function name拿掉
  // (function main(){}).toString()
  return fn.toString().replace("function", "function main");
}

function getRequestCustomFunction(script: string): RequireCustomFunction {
  console.log(script);
  eval.apply(null, [script]);
  // 避免混淆器
  return eval.apply(null, ["main"]);
}

export function doRequireCustom(
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  require: RequireCustom,
  requireCustomID: string,
  varCtxID: string
): GameContext {
  getRequestCustomFunction(requireCustomID)(gameCtx, blockPayload, varCtxID);
  return gameCtx;
}
