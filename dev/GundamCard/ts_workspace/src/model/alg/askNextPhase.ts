import {
  Context,
  CardPosition,
  Action,
  Payment,
  ActionEffect,
  CardType,
  Color,
  GameState,
  CardState,
  Phase,
} from "../../tool/types";
import { Card, getCard, Table } from "../../tool/table";
import { askRowData } from "../../tool/data";
import { Script } from "../../script/types";
import { PlayerA, PlayerB } from "../../app/context";

export function askNextPhase(ctx: Context, phase: Phase): Phase {
  const [main, sub] = phase;
  switch (sub) {
    case "before":
      // 設置階段沒有規定效果
      if (main == "set") {
        return ["draw", sub];
      }
      return [main, "effect"];
    case "after":
      switch (main) {
        case "draw":
          return ["set", "before"];
        case "set":
          return ["attack", "before"];
        case "attack":
          return ["guard", "before"];
        case "guard":
          return ["damage", "before"];
        case "damage":
          return ["return", "before"];
        case "return":
          return ["draw", "before"];
        default:
          throw new Error(`未知的狀態:${main}`);
      }
    case "effect":
      return [main, "after"];
    default:
      throw new Error(`未知的狀態:${phase}`);
  }
}
