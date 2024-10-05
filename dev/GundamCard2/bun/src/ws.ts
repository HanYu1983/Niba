import { WebSocket } from 'ws';
import { AbsoluteBaSyouFn } from './game/define/BaSyou';
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from './game/define/PlayerID';
import { setActivePlayerID } from './game/gameState/ActivePlayerComponent';
import { createCardWithProtoIds } from './game/gameState/CardTableComponent';
import { applyFlow } from './game/gameStateWithFlowMemory/applyFlow';
import { Flow } from './game/gameStateWithFlowMemory/Flow';
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from './game/gameStateWithFlowMemory/GameStateWithFlowMemory';
import { queryFlow } from './game/gameStateWithFlowMemory/queryFlow';
import { getPrototype, loadPrototype } from './script';
import { getImmediateEffects, getStackEffects } from './game/gameState/EffectStackComponent';
import { Effect, EffectFn } from './game/define/Effect';
import { always, fromPairs, map, pipe } from 'ramda';
import { CardPrototype } from './game/define/CardPrototype';
import { getCardTexts } from './game/gameState/card';
import { BattleBonus, CardText } from './game/define/CardText';
import { getSetGroupBattlePoint } from './game/gameState/setGroup';
import { getCardLikeItemIds, getItemBaSyou, getItemPrototype } from './game/gameState/ItemTableComponent';
import { getGlobalEffects } from './game/gameState/globalEffects';
import { GlobalEffect } from './game/define/GlobalEffect';
const fs = require('fs').promises;

async function createWS() {
  const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
  await Promise.all(blackT3.map(loadPrototype))
  let ctx = (await loadGameStateFromDesk()) || createGameStateWithFlowMemory()
  function getGameState() {
    return ctx
  }
  function getGameStateViewModel() {
    const cards = ctx.cards
    const stackEffects = getStackEffects(ctx).map(effectToView)
    const immediateEffects = getImmediateEffects(ctx).map(effectToView)
    const coins = ctx.coins
    const table = ctx.table
    const itemStates = ctx.itemStates
    const activePlayerId = ctx.activePlayerID
    const phase = ctx.phase
    const protos = pipe(
      always(getCardLikeItemIds(ctx)),
      map(itemId => [itemId, getItemPrototype(ctx, itemId)] as [string, CardPrototype]),
      fromPairs
    )()
    const texts = pipe(
      always(getCardLikeItemIds(ctx)),
      map(itemId => [itemId, getCardTexts(ctx, itemId).map(t => t.description)] as [string, string[]]),
      fromPairs
    )()
    const battlePoints = pipe(
      always(getCardLikeItemIds(ctx)),
      map(itemId => [itemId, getSetGroupBattlePoint(ctx, itemId)] as [string, BattleBonus]),
      fromPairs
    )()
    const globalEffects = pipe(
      always(getCardLikeItemIds(ctx)),
      map(itemId => [itemId, getGlobalEffects(ctx, null).filter(ge => ge.cardIds.includes(itemId))] as [string, GlobalEffect[]]),
      fromPairs
    )()
    const positions = pipe(
      always(getCardLikeItemIds(ctx)),
      map(itemId => [itemId, getItemBaSyou(ctx, itemId).value] as [string, any]),
      fromPairs
    )()

    function effectToView(e: Effect) {
      return {
        type: e.reason[0],
        cardId: EffectFn.getCardID(e),
        playerId: e.reason[0] != "GameRule" ? EffectFn.getPlayerID(e) : null,
        description: e.text.description || e.description,
      }
    }

    return {
      cards,
      stackEffects,
      immediateEffects,
      coins,
      table,
      itemStates,
      activePlayerId,
      phase,
      protos,
      texts,
      battlePoints,
      globalEffects,
      positions
    }
  }
  function newGameState() {
    ctx = createGameStateWithFlowMemory()
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), blackT3) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), blackT3) as GameStateWithFlowMemory
  }
  function queryCommand(playerId: string): Flow[] {
    return queryFlow(ctx, playerId)
  }
  function applyCommand(playerId: string, cmd: Flow) {
    ctx = applyFlow(ctx, playerId, cmd)
  }
  async function writeGameStateToDesk() {
    const writeCtx = { ...ctx }
    writeCtx.globalEffectPool = {}
    writeCtx.commandEffectTips = []
    await fs.writeFile('__gameState.json', JSON.stringify(writeCtx, null, 2));
  }
  async function loadGameStateFromDesk(): Promise<GameStateWithFlowMemory | null> {
    try {
      const gameStateData = await fs.readFile('__gameState.json', 'utf8');
      return JSON.parse(gameStateData) as GameStateWithFlowMemory;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const wss = new WebSocket.Server({ port: 8080 });
  const wsPool: { [key: string]: WebSocket } = {}

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    ws.once("message", (message: string) => {
      // 將message轉成本地串，不然相等性會失效
      const playerId = `${message}`
      console.log(`player try enter: ${playerId}`);
      if (PlayerIDFn.getAll().includes(playerId as PlayerID) != true) {
        console.log(`傳錯代號，踢出:${playerId}`)
        ws.close()
        return
      }
      console.log(`player enter: ${playerId}`);
      wsPool[playerId] = ws
      ws.send(JSON.stringify(queryCommand(playerId)))
      ws.on("message", (message: string) => {
        const flow = JSON.parse(message) as Flow
        applyCommand(playerId, flow)
        Object.keys(wsPool).forEach(playerId => {
          wsPool[playerId].send(JSON.stringify(queryCommand(playerId)))
          wsPool[playerId].send(JSON.stringify(getGameState()))
        })
      })
      ws.on('close', () => {
        console.log(`player exit: ${playerId}`);
        delete wsPool[playerId]
      });
    })
  });
}

createWS().catch(console.log)