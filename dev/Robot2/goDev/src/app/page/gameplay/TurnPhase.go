package gameplay

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func TurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	ctx := origin
	switch ctx.Model.QueryActivePlayer() {
	case "":
		return origin, false, fmt.Errorf("unknown player")
	case protocol.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}
