package impl

import (
	"src/game/combat"
	"src/game/gamemap"
)

type IGame interface {
	gamemap.IGameMapComponent
	combat.BattleComponent
}
