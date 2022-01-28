import { log2 } from "../../../../tool/logger";
import { GameContext, getSetGroupCards } from "./gameContext";
export const jsonfp = require("jsonfp");
// 使用前先呼叫
export function initJsonfp() {
  jsonfp.init();
  jsonfp.addMethod("error", (input: any, p: any) => {
    throw new Error(`[jsonfp.error]${p}`);
  });
  jsonfp.addMethod("log", (input: any, p: any) => {
    log2("jsonfp", input, p);
    return input;
  });
  jsonfp.addMethod(
    "getSetGroupCards",
    (ctx: GameContext, { cardID }: { cardID: string }) => {
      if (cardID == null) {
        throw new Error("cardID not found");
      }
      return getSetGroupCards(ctx, cardID);
    }
  );
}

export type Keyword =
  | "->"
  | "chain"
  | "convert"
  | "formula"
  | "eval"
  | "if"
  | "map"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "random"
  | "min"
  | "max"
  | "and"
  | "or"
  | "bitwise and"
  | "bitwise or"
  | "bitwise exclusive-or"
  | "compact"
  | "difference"
  | "flatten"
  | "intersection"
  | "take"
  | "union"
  | "zipObject"
  | "clone"
  | "filter"
  | "find"
  | "getter"
  | "merge"
  | "omit"
  | "pick"
  | "pluck"
  | "reduce"
  | "size"
  | "where"
  | "=="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<=";

export type JsonfpExpr =
  | string
  | number
  | boolean
  | {
      "->"?: JsonfpExpr[];
      chain?: JsonfpExpr[];
      convert?: {
        var: { [key: string]: string };
        formula: JsonfpExpr;
      };
      formula?: { var: string | string[]; expr: JsonfpExpr };
      eval?: JsonfpExpr;
      if?: [JsonfpExpr, JsonfpExpr, JsonfpExpr];
      map?: JsonfpExpr;
      add?: JsonfpExpr;
      subtract?: JsonfpExpr;
      multiply?: JsonfpExpr;
      divide?: JsonfpExpr;
      random?: JsonfpExpr;
      min?: JsonfpExpr;
      max?: JsonfpExpr;
      and?: JsonfpExpr[];
      or?: JsonfpExpr[];
      "bitwise and"?: JsonfpExpr;
      "bitwise or"?: JsonfpExpr;
      "bitwise exclusive-or"?: JsonfpExpr;
      compact?: JsonfpExpr;
      difference?: JsonfpExpr;
      flatten?: JsonfpExpr;
      intersection?: JsonfpExpr;
      take?: JsonfpExpr;
      union?: JsonfpExpr;
      zipObject?: JsonfpExpr;
      clone?: JsonfpExpr;
      filter?: JsonfpExpr;
      find?: JsonfpExpr;
      getter?: JsonfpExpr;
      merge?: JsonfpExpr;
      omit?: JsonfpExpr;
      pick?: JsonfpExpr;
      pluck?: JsonfpExpr;
      reduce?: Keyword;
      size?: null;
      where?: JsonfpExpr;
      "=="?: JsonfpExpr;
      "!="?: JsonfpExpr;
      ">"?: JsonfpExpr;
      ">="?: JsonfpExpr;
      "<"?: JsonfpExpr;
      "<="?: JsonfpExpr;
      cardPower?: { ctx: "$ctx" };
    };
