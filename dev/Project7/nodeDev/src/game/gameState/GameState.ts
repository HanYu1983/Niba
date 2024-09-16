import {
  getCard,
  CardTableComponent,
  getCardIds,
  setCard,
} from "./CardTableComponent"
import { ItemStateComponent, getItemState, getItemStateValues, setItemState } from "./ItemStateComponent";
import { isBattle, IsBattleComponent } from "./IsBattleComponent";
import { getSetGroupCards, getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { addDestroyEffect, addImmediateEffect, EffectStackComponent } from "./EffectStackComponent";
import { log } from "../../tool/logger";
import { Action, ActionFn, ActionTitle, ActionTitleFn, BattleBonus, Condition, ConditionFn, ConditionTitle, ConditionTitleFn, getOnSituationFn, getTextsFromTokuSyuKouKa, LogicTreeActionFn, OnEventFn, OnEventTitle, OnSituationFn, Situation, CardText, CardTextFn, TextSpeicalEffect, TextSpeicalEffectFn } from "../define/CardText";
import { GlobalEffect } from "../define/GlobalEffect";
import { Phase, PhaseFn } from "../define/Timing";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { GameEvent, GameEventTitle } from "../define/GameEvent";
import { DEFAULT_TABLE } from "../../tool/table";
import { BattlePoint, BattlePointFn } from "../define/BattlePoint";
import { always, concat, filter, flatten, flow, lift, map, pipe, reduce, repeat, sum } from "ramda";
import { createBridge } from "../bridge/createBridge";
import { CoinTableComponent, getCardIdByCoinId, getCoins } from "./CoinTableComponent";
import { addCoinsToCard, getItem, getItemBaSyou, getItemController, getItemIdsByBasyou, getItemPrototype, isCard, isChip, Item, ItemTableComponent } from "./ItemTableComponent";
import { StrBaSyouPair, Tip, TipFn } from "../define/Tip";
import { ToolFn } from "../tool";
import { TargetMissingError } from "../define/GameError";
import { CoinFn } from "../define/Coin";
import { ItemState, ItemStateFn } from "../define/ItemState";
import { PhaseComponent } from "./PhaseComponent";
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "./globalEffects";
import { getCardTexts, getCardBattlePoint, getCardHasSpeicalEffect, getCardIdsCanPayRollCost } from "./card";
import { isABattleGroup, getBattleGroup, getBattleGroupBattlePoint } from "./battleGroup";
import { getOnEventTitleFn } from "./effect";
import { ActivePlayerComponent } from "./ActivePlayerComponent";

export type PlayerState = {
  id: string;
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type PlayerStateComponent = {
  playerStates: { [key: string]: PlayerState };
}

export type GameState = {
  globalEffectPool: { [key: string]: GlobalEffect[] }
} & SetGroupComponent
  & IsBattleComponent
  & CardTableComponent
  & EffectStackComponent
  & ItemStateComponent
  & PhaseComponent
  & PlayerStateComponent
  & ActivePlayerComponent
  & CoinTableComponent
  & ItemTableComponent;

export function createGameState(): GameState {
  return {
    cards: {},
    effects: {},
    table: DEFAULT_TABLE,
    chips: {},
    chipProtos: {},
    itemStates: {},
    phase: PhaseFn.getAll()[0],
    playerStates: {},
    activePlayerID: null,
    commandEffect: [],
    immediateEffect: [],
    stackEffect: [],
    destroyEffect: [],
    setGroupLink: {},
    isBattle: {},
    coins: {},
    coinId2cardId: {},
    globalEffectPool: {}
  }
}

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerEvent(
  ctx: GameState,
  evt: GameEvent
): GameState {
  const bridge = createBridge()
  // command
  const commands = pipe(
    always(getCardIds(ctx)),
    map(cardId => {
      const proto = getItemPrototype(ctx, cardId)
      if (proto.commandText?.onEvent) {
        return { cardId: cardId, texts: getCardTexts(ctx, cardId) }
      }
    }),
    infos => infos.filter(v => v) as { cardId: string, texts: CardText[] }[],
  )()
  return pipe(
    always(getCardIds(ctx)),
    map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
    concat(commands),
    reduce((ctx, { cardId, texts }) => {
      return pipe(
        always(texts),
        reduce((ctx, text) => {
          const effect: Effect = {
            id: ToolFn.getUUID("triggerTextEvent"),
            reason: ["Event", cardId, evt],
            text: text
          }
          return getOnEventTitleFn(text)(ctx, effect, bridge)
        }, ctx)
      )()
    }, ctx)
  )()
}

// setgroup
export function getSetGroupBattlePoint(ctx: GameState, cardId: string): BattleBonus {
  return pipe(
    always(getSetGroupCards(ctx, cardId)),
    map(setGroupCardID => getCardBattlePoint(ctx, setGroupCardID)),
    reduce(BattlePointFn.add, BattlePointFn.getAllStar()),
    BattlePointFn.toBattleBonus
  )()
}