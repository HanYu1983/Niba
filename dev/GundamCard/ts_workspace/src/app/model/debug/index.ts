import { defaultContext } from "../../types";
import { testPlayCard } from "./testPlayCard";
import { testPlayG } from "./testPlayG";
import { testPhase } from "./testPhase";
import { testAttack } from "./testAttack";
import { onEffectCompleted } from "../alg/onEffectCompleted";
import { testDestroyEffect } from "./testDestroyEffect";

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
  const testFns = [
    testScript,
    testPlayG,
    testPhase,
    testPlayCard,
    testAttack,
    testDestroyEffect,
  ];
  testFns.forEach((f) => {
    console.log(`=========${f.name}=========`);
    f();
  });
}
