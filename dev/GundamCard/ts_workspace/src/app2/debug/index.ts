import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../tool/tool/basic/gameContext";
import {
  initState,
  updateEffect,
  //updateCommand,
  triggerTextEvent,
  getTip,
  updateCommand,
} from "../tool/alg/handleGameContext";
import { createCard } from "../../tool/table";
import { getBaShouID, PlayerA, PlayerB } from "../tool/tool/basic/basic";
import {
  recurRequire,
  RequireYesNo,
  RequireTarget,
  BlockPayload,
  DEFAULT_BLOCK_PAYLOAD,
} from "../tool/tool/basic/blockPayload";
import { testFlow1, testFlow2 } from "./testFlow";
import { testKaiSo1 } from "./testKaiSo";
import { createTokuSyuKouKaText } from "../tool/alg/script/createTokuSyuKouKaText";
import { doRequire } from "../tool/alg/handleBlockPayload";
import { doEffectRequire } from "../tool/alg/handleClient";

export function testDryRun() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  (table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "手札"],
    }),
    [
      "179016_04B_U_WT075C_white",
      "179030_11E_U_BL208S_blue",
      "179030_11E_U_BL215R_blue",
      "179001_01A_CH_WT007R_white",
    ]
  )),
    (table = createCard(
      table,
      PlayerA,
      getBaShouID({
        id: "AbsoluteBaSyou",
        value: [PlayerB, "手札"],
      }),
      [
        "179016_04B_U_WT075C_white",
        "179030_11E_U_BL208S_blue",
        "179030_11E_U_BL215R_blue",
        "179001_01A_CH_WT007R_white",
      ]
    )),
    (ctx = {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        table: table,
      },
    });
  console.log("initState");
  ctx = initState(ctx);
  console.log("updateEffect");
  ctx = updateEffect(ctx);
  console.log("updateCommand");
  ctx = updateCommand(ctx);
  console.log("triggerTextEvent");
  ctx = triggerTextEvent(ctx, {
    id: "GameEventOnTiming",
    timing: ctx.gameState.timing,
  });
  ctx.gameState.immediateEffect.forEach((effect) => {
    if (effect.require == null) {
      return;
    }
    const key = ((): string | null => {
      let _key: string | null = null;
      console.log("recurRequire");
      recurRequire(effect.require, (r) => {
        if (r.id != "RequireTarget") {
          return r;
        }
        if (r.targets["５以下の防御力を持つ敵軍ユニット１枚"] != null) {
          _key = r.key || null;
        }
        return r;
      });
      return _key;
    })();
    console.log("getTip");
    const tip = getTip(
      ctx,
      effect.id || "",
      key || "",
      "５以下の防御力を持つ敵軍ユニット１枚"
    );
  });
}

export function test() {
  [testDryRun, testFlow1, testFlow2, testKaiSo1].forEach((testF: Function) => {
    console.log(`============${testF.name}===========`);
    testF();
  });
}
