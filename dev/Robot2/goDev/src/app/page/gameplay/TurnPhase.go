package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func TurnPhase(origin uidata.UI, player protocol.Player) (uidata.UI, bool, error) {
	var err error
	ctx := origin
	view := def.View
	var ctxObj interface{}
	ctxObj, err = ctx.Model.OnPlayerTurnStart(ctx, player)
	if err != nil {
		return origin, false, err
	}
	ctx = ctxObj.(uidata.UI)
	view.RenderTurnStart(ctx, player)
	var cancel bool
	switch player.ID {
	case "":
		return origin, false, fmt.Errorf("unknown player")
	case protocol.PlayerIDPlayer:
		ctx, cancel, err = PlayerTurnPhase(ctx)
	default:
		ctx, cancel, err = EnemyTurnPhase(ctx)
	}
	if err != nil {
		return origin, false, err
	}
	if cancel {
		return origin, cancel, err
	}
	ctxObj, err = ctx.Model.OnPlayerTurnEnd(ctx, player)
	if err != nil {
		return origin, false, err
	}
	ctx = ctxObj.(uidata.UI)
	return ctx, false, nil
}
