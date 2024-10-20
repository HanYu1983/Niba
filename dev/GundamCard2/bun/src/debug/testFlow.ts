import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { getBattleGroupBattlePoint, getBattleGroup } from "../game/gameState/battleGroup";
import { getCardBattlePoint } from "../game/gameState/card";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { clearGlobalEffects, createAllCardTexts, getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects";
import { checkIsBattle } from "../game/gameState/IsBattleComponent";
import { getItemPrototype } from "../game/gameState/ItemTableComponent";
import { setSetGroupParent } from "../game/gameState/SetGroupComponent";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory, initState } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { loadPrototype } from "../script";

export async function testBattleBonus() {
  await loadPrototype("179016_04B_U_WT075C_white")
  await loadPrototype("179001_01A_CH_WT007R_white")
  await loadPrototype("testBPBonus")
  let ctx = createGameStateWithFlowMemory();
  ctx = {
    ...ctx,
    activePlayerID: PlayerA,
    phase: ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
  };
  ctx = setSetGroupParent(ctx, "a1", "a2") as GameStateWithFlowMemory
  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"),
    [
      {
        id: "a1",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      },
      {
        id: "a2",
        protoID: "179001_01A_CH_WT007R_white",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      }
    ]
  ) as GameStateWithFlowMemory

  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"),
    [
      {
        id: "b1",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: true,
        ownerID: PlayerB,
        isRoll: false,
      },
      {
        id: "b2",
        protoID: "179016_04B_U_WT075C_white",
        isFaceDown: true,
        ownerID: PlayerB,
        isRoll: false,
      },
    ]
  ) as GameStateWithFlowMemory

  // createAllCardTexts(ctx, null).forEach(([item, texts]) => {
  //   const proto = getItemPrototype(ctx, item.id)
  //   console.log(item.id, proto.title)
  //   texts.forEach(text => {
  //     console.log(text.description)
  //   })
  // })

  ctx = initState(ctx, [], []);
  {
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges) as GameStateWithFlowMemory
    const [x, y, z] = getCardBattlePoint(ctx, "a1", { ges: ges });
    if (x != 5) {
      throw new Error("x != 5");
    }
    if (y != 2) {
      throw new Error("y != 2");
    }
    if (z != 4) {
      throw new Error("z != 4");
    }
  }
  {
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges) as GameStateWithFlowMemory
    ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
    const bta = getBattleGroupBattlePoint(
      ctx,
      getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")),
      { ges: ges }
    );
    if (bta != 7) {
      throw new Error("must be 7");
    }
  }
  console.log("給a1獲得+3/+3/+3");
  ctx = addCards(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "配備エリア"),
    [
      {
        id: "a3",
        protoID: "testBPBonus",
        isFaceDown: false,
        ownerID: PlayerA,
        isRoll: false,
      }
    ]
  ) as GameStateWithFlowMemory
  ctx = clearGlobalEffects(ctx) as GameStateWithFlowMemory
  {
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges) as GameStateWithFlowMemory
    const [x, y, z] = getCardBattlePoint(ctx, "a1", { ges: ges });
    if (x != 8) {
      throw new Error("x != 8");
    }
    if (y != 5) {
      throw new Error("y != 5");
    }
    if (z != 7) {
      throw new Error("z != 7");
    }
  }
  {
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges) as GameStateWithFlowMemory
    const bta = getBattleGroupBattlePoint(
      ctx,
      getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")),
      { ges: ges }
    );
    if (bta != 13) {
      throw new Error("must be 13");
    }
  }
}