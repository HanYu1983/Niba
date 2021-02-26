package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "GameLoop", "start")
	var err error
	ctx := origin
	view := def.View
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, true)
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, err
	}
	for {
		var activePlayer protocol.Player
		activePlayer, err = ctx.Model.QueryActivePlayer()
		if err != nil {
			return origin, err
		}
		var cancel bool
		ctx, cancel, err = TurnPhase(ctx, activePlayer)
		if err != nil {
			return origin, err
		}
		if cancel {
			break
		}
		if ctx.Model.IsDone() != nil {
			break
		}
		ctx.Model, err = ctx.Model.NextPlayer()
		if err != nil {
			return origin, err
		}
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, false)
	log.Log(protocol.LogCategoryPhase, "GameLoop", "end")
	return ctx, nil
}
