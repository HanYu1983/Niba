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
import * as getPlayCardEffect from "./createPlayCardEffects"
import * as getNextPhase from "./getNextPhase"
import * as swapItem from "./doItemSwap"
import * as doItemMove from "./doItemMove"
import * as getConditionTitleFn from "./createConditionTitleFn"
import * as getActionTitleFn from "./createActionTitleFn"
import * as getOnEventTitleFn from "./createOnEventTitleFn"
import * as doSetItemRollState from "./doItemSetRollState"
import * as doCountryDamage from "./doCountryDamage"
import * as doItemSetDestroy from "./doItemSetDestroy"
import * as doItemSetGlobalEffectsUntilEndOfTurn from "./doItemSetGlobalEffectsUntilEndOfTurn"

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
    ...getOnEventTitleFn,
    ...doSetItemRollState,
    ...doCountryDamage,
    ...doItemSetDestroy,
    ...doItemSetGlobalEffectsUntilEndOfTurn
}