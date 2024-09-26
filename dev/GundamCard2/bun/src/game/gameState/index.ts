import * as GameState from "./GameState"
import * as CardState from "./ItemStateComponent"
import * as EffectStackComponent from "./EffectStackComponent"
import * as IsBattleComponent from "./IsBattleComponent"
import * as SetGroupComponent from "./SetGroupComponent"
import * as CardTableComponent from "./CardTableComponent"
import * as CoinTableComponent from "./CoinTableComponent"
import * as ItemTableComponent from "./ItemTableComponent"
import * as card from "./card"
import * as battleGroup from "./battleGroup"
import * as doEffect from "./doEffect"
import * as player from "./player"
import * as setGroup from "./setGroup"
import * as triggerEvent from "./triggerEvent"
import * as PhaseComponent from "./PhaseComponent"
import * as globalEffects from "./globalEffects"
import * as ActivePlayerComponent from "./ActivePlayerComponent"
import * as PlayerStateComponent from "./PlayerStateComponent"
import * as RuntimeBattleAreaComponent from "./RuntimeBattleAreaComponent"
import * as getPlayCardEffect from "./getPlayCardEffect"
import * as getNextPhase from "./getNextPhase"
import * as swapItem from "./doItemSwap"
import * as doItemMove from "./doItemMove"
import * as getConditionTitleFn from "./getConditionTitleFn"
import * as getActionTitleFn from "./getActionTitleFn"
import * as getOnEventTitleFn from "./getOnEventTitleFn"
export const GameStateFn = {
    ...GameState,
    ...CardState,
    ...EffectStackComponent,
    ...IsBattleComponent,
    ...SetGroupComponent,
    ...CardTableComponent,
    ...CoinTableComponent,
    ...ItemTableComponent,
    ...card,
    ...battleGroup,
    ...doEffect,
    ...player,
    ...setGroup,
    ...triggerEvent,
    ...PhaseComponent,
    ...globalEffects,
    ...ActivePlayerComponent,
    ...PlayerStateComponent,
    ...RuntimeBattleAreaComponent,
    ...getPlayCardEffect,
    ...getNextPhase,
    ...swapItem,
    ...doItemMove,
    ...getConditionTitleFn,
    ...getActionTitleFn,
    ...getOnEventTitleFn
}