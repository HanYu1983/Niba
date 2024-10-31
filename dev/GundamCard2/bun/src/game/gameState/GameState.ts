import { DEFAULT_TABLE } from "../../tool/table";
import { CommandEffectTip } from "../define/CommandEffectTip";
import { GlobalEffect } from "../define/GlobalEffect";
import { PhaseFn } from "../define/Timing";
import { ActivePlayerComponent } from "./ActivePlayerComponent";
import { CardTableComponent } from "./CardTableComponent";
import { CoinTableComponent } from "./CoinTableComponent";
import { EffectStackComponent } from "./EffectStackComponent";
import { IsBattleComponent } from "./IsBattleComponent";
import { ItemStateComponent } from "./ItemStateComponent";
import { ItemTableComponent } from "./ItemTableComponent";
import { MessageComponent } from "./MessageComponent";
import { PhaseComponent } from "./PhaseComponent";
import { PlayerStateComponent } from "./PlayerStateComponent";
import { RuntimeBattleAreaComponent } from "./RuntimeBattleAreaComponent";
import { SetGroupComponent, createSetGroupComponent } from "./SetGroupComponent";

export type GameState = {
  isGameState: true,
  globalEffectPool: { [key: string]: GlobalEffect[] },
  turn: number;
} & SetGroupComponent
  & IsBattleComponent
  & CardTableComponent
  & EffectStackComponent
  & ItemStateComponent
  & PhaseComponent
  & PlayerStateComponent
  & ActivePlayerComponent
  & CoinTableComponent
  & ItemTableComponent
  & RuntimeBattleAreaComponent
  & MessageComponent;

export function createGameState(): GameState {
  return {
    isGameState: true,
    cards: {},
    effects: {},
    table: DEFAULT_TABLE,
    chips: {},
    chipProtos: {},
    itemStates: {},
    phase: PhaseFn.getAll()[0],
    playerStates: {},
    activePlayerID: null,
    immediateEffect: [],
    stackEffect: [],
    destroyEffect: [],
    commandEffects: [],
    commandEffectTips: [],
    hasCheck: false,
    battleSnapshot: {},
    coins: {},
    coinId2cardId: {},
    globalEffectPool: {},
    messageTopId: 0,
    messages: [],
    messagesCurrentEffect: null,
    messagesIsPlayerRead: {},
    turn: 0,
    ...createSetGroupComponent(),
  }
}



