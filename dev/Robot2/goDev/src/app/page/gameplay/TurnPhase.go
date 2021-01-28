package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func TurnPhase(origin uidata.UI) (uidata.UI, error) {
	model := def.Model
	switch model.QueryActivePlayer() {
	case "":
		return origin, fmt.Errorf("unknown player")
	case protocol.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}
