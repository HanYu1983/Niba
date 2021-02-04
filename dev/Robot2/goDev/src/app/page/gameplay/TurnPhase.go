package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func TurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	ctx := origin
	view := def.View
	player, err := ctx.Model.QueryActivePlayer()
	if err != nil {
		return origin, false, err
	}
	view.RenderTurnStart(ctx, player)
	switch player.ID {
	case "":
		return origin, false, fmt.Errorf("unknown player")
	case protocol.PlayerIDPlayer:
		return PlayerTurnPhase(origin)
	default:
		return EnemyTurnPhase(origin)
	}
}
