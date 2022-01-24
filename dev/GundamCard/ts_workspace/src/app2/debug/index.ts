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
  getClientCommand,
} from "../tool/alg/handleGameContext";
import { createCard } from "../../tool/table";
import {
  getBaShouID,
  PlayerA,
  PlayerB,
  TIMING_CHART,
} from "../tool/tool/basic/basic";
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
import { doFeedback, doRequire } from "../tool/alg/handleBlockPayload";
import { doEffect, doEffectRequire } from "../tool/alg/handleClient";

export function test() {
  [
    testDryRun,
    testFlow1,
    testFlow2,
    testKaiSo1,
    testClientCommand,
    testClientCommand2,
  ].forEach((testF: Function) => {
    console.log(
      `================================================================`
    );
    console.log(`${testF.name}`);
    console.log(
      `================================================================`
    );
    testF();
  });
}

export function testClientCommand2() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "手札"],
    }),
    ["179016_04B_U_WT075C_white"]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
      // @ts-ignore
      timing: TIMING_CHART.find((t) => {
        return t[1][0] == "配備フェイズ" && t[1][1] == "フリータイミング";
      }),
    },
  };
  ctx = initState(ctx);
  ctx = updateCommand(ctx);
  let cmdList = getClientCommand(ctx, PlayerA);
  if (cmdList.length != 1) {
    throw new Error("一開始沒有G, 只能有一個指令");
  }
  console.log("加入5個G");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: createCard(
        ctx.gameState.table,
        PlayerA,
        getBaShouID({
          id: "AbsoluteBaSyou",
          value: [PlayerA, "Gゾーン"],
        }),
        [
          "179016_04B_U_WT075C_white",
          "179016_04B_U_WT075C_white",
          "179016_04B_U_WT075C_white",
          "179016_04B_U_WT075C_white",
          "179016_04B_U_WT075C_white",
        ]
      ),
    },
  };
  console.log("加入G後要呼叫updateCommand");
  ctx = updateCommand(ctx);
  cmdList = getClientCommand(ctx, PlayerA);
  if (cmdList.length != 2) {
    throw new Error("加入5個G後，要有2個指令");
  }
  const playUnitCmd = cmdList[0];
  console.log("強制指令activeEffectID，為了呼叫doEffect");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: playUnitCmd.id || null,
    },
  };
  ctx = doEffect(ctx, PlayerA, playUnitCmd.id || "");
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })
    ].filter((c) => c.tap).length != 1
  ) {
    console.log("必須横置1張國力");
  }
  if (
    ctx.gameState.table.cardStack[
      getBaShouID({
        id: "AbsoluteBaSyou",
        value: [PlayerA, "プレイされているカード"],
      })
    ].filter((c) => c.tap).length != 1
  ) {
    console.log("卡片必須移到プレイされているカード");
  }
}

export function testClientCommand() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "手札"],
    }),
    ["179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white"]
  );
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerA, "配備エリア"],
    }),
    ["179016_04B_U_WT075C_white"]
  );
  table = createCard(
    table,
    PlayerA,
    getBaShouID({
      id: "AbsoluteBaSyou",
      value: [PlayerB, "手札"],
    }),
    ["179016_04B_U_WT075C_white"]
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
    },
  };
  ctx = initState(ctx);
  console.log(ctx);
  ctx = updateCommand(ctx);
  let cmdList = getClientCommand(ctx, PlayerA);
  if (cmdList.length != 0) {
    throw new Error("遊戲剛開始的時機不該有任何指令");
  }
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      // @ts-ignore
      timing: TIMING_CHART.find((t) => {
        return t[1][0] == "配備フェイズ" && t[1][1] == "フリータイミング";
      }),
    },
  };
  cmdList = getClientCommand(ctx, PlayerA);
  if (cmdList.length != 2) {
    throw new Error("配置階段主動A必須有2個指令");
  }
  cmdList = getClientCommand(ctx, PlayerB);
  if (cmdList.length > 0) {
    throw new Error("配置階段被動玩家必須沒有指令");
  }
  console.log("切換主動玩家");
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activePlayerID: PlayerB,
    },
  };
  cmdList = getClientCommand(ctx, PlayerB);
  if (cmdList.length != 1) {
    throw new Error("配置階段主動A必須有1個指令");
  }
  cmdList = getClientCommand(ctx, PlayerA);
  if (cmdList.length > 0) {
    throw new Error("配置階段被動玩家必須沒有指令");
  }
}

export function testDryRun() {
  let ctx = DEFAULT_GAME_CONTEXT;
  let table = ctx.gameState.table;
  table = createCard(
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
  );
  table = createCard(
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
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
    },
  };
  console.log("initState");
  ctx = initState(ctx);
  console.log(ctx);
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