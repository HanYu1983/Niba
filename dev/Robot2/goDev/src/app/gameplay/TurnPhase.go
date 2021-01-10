package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

func TurnPhase(origin uidata.UI) (uidata.UI, error) {
	switch model.QueryActivePlayer() {
	case data.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}
