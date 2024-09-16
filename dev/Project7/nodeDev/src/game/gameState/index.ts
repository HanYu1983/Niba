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
import * as effect from "./effect"
export const GameStateFn = {
    ...GameState,
    ...CardState,
    ...EffectStackComponent,
    ...IsBattleComponent,
    ...SetGroupComponent,
    //...CardTableComponent,
    //...CoinTableComponent,
    ...ItemTableComponent,
    ...card,
    ...battleGroup,
    ...effect
}