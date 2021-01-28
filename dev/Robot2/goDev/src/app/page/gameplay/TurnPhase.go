package gameplay

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/uidata"
	"fmt"
)

func TurnPhase(origin uidata.UI) (uidata.UI, error) {
	model := def.Model
	switch model.QueryActivePlayer() {
	case "":
		return origin, fmt.Errorf("unknown player")
	case data.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}
