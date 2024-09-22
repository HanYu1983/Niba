import { DEFAULT_TABLE } from "../../tool/table";
import { GlobalEffect } from "../define/GlobalEffect";
import { PhaseFn } from "../define/Timing";
import { ActivePlayerComponent } from "./ActivePlayerComponent";
import { CardTableComponent } from "./CardTableComponent";
import { CoinTableComponent } from "./CoinTableComponent";
import { EffectStackComponent } from "./EffectStackComponent";
import { IsBattleComponent } from "./IsBattleComponent";
import { ItemStateComponent } from "./ItemStateComponent";
import { ItemTableComponent } from "./ItemTableComponent";
import { PhaseComponent } from "./PhaseComponent";
import { PlayerStateComponent } from "./PlayerStateComponent";
import { RuntimeBattleAreaComponent } from "./RuntimeBattleAreaComponent";
import { SetGroupComponent, createSetGroupComponent } from "./SetGroupComponent";

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
  & ItemTableComponent
  & RuntimeBattleAreaComponent;

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
    immediateEffect: [],
    stackEffect: [],
    isBattle: {},
    coins: {},
    coinId2cardId: {},
    globalEffectPool: {},
    ...createSetGroupComponent(),
  }
}



