import * as GameState from "./GameState"
import * as CardState from "./CardStateComponent"
import * as EffectStackComponent from "./EffectStackComponent"
import * as IsBattleComponent from "./IsBattleComponent"
import * as SetGroupComponent from "./SetGroupComponent"
import * as CardTableComponent from "./CardTableComponent"
export const GameStateFn = {
    ...GameState,
    ...CardState,
    ...EffectStackComponent,
    ...IsBattleComponent,
    ...SetGroupComponent,
    ...CardTableComponent,
}