import { mapCard, moveCard, createCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  defaultContext,
} from "../../tool/types";
import { askPlayerG, cardPositionID, onEffectCompleted } from "../alg";
import { testPlayCard } from "./testPlayCard";
import { testPlayG } from "./testPlayG";
import { testPhase } from "./testPhase";
import { testAttack } from "./testAttack";

function testScript() {
  const ctx = onEffectCompleted(defaultContext, {
    id: "ActionEffect",
    action: {
      id: "PlayCardAction",
      playerID: "",
      cardID: null,
      from: null,
      to: null,
    },
    currents: [],
  });
  console.log(ctx);
}

export function test() {
  const testFns = [testScript, testPlayG, testPhase, testPlayCard, testAttack];
  testFns.forEach((f) => {
    console.log(`=========${f.name}=========`);
    f();
  });
}
