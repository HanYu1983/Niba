export const jsonfp = require("jsonfp");
jsonfp.init();

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

export type Expr =
  | string
  | number
  | boolean
  | {
      "->"?: Expr[];
      chain?: Expr[];
      convert?: {
        var: { [key: string]: string };
        formula: Expr;
      };
      formula?: { var: string | string[]; expr: Expr };
      eval?: Expr;
      if?: [Expr, Expr, Expr];
      map?: Expr;
      add?: Expr;
      subtract?: Expr;
      multiply?: Expr;
      divide?: Expr;
      random?: Expr;
      min?: Expr;
      max?: Expr;
      and?: Expr;
      or?: Expr;
      "bitwise and"?: Expr;
      "bitwise or"?: Expr;
      "bitwise exclusive-or"?: Expr;
      compact?: Expr;
      difference?: Expr;
      flatten?: Expr;
      intersection?: Expr;
      take?: Expr;
      union?: Expr;
      zipObject?: Expr;
      clone?: Expr;
      filter?: Expr;
      find?: Expr;
      getter?: Expr;
      merge?: Expr;
      omit?: Expr;
      pick?: Expr;
      pluck?: Expr;
      reduce?: Keyword;
      size?: null;
      where?: Expr;
      "=="?: Expr;
      "!="?: Expr;
      ">"?: Expr;
      ">="?: Expr;
      "<"?: Expr;
      "<="?: Expr;
      cardPower?: { ctx: "$ctx" };
    };
