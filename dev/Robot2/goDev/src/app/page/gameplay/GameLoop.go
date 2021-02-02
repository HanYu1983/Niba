package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"time"
	"tool/log"
)

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "GameLoop", "start")
	view := def.View
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, true)
	for {
		view.Render(ctx)
		time.Sleep(time.Second)
		var cancel bool
		ctx, cancel, err = TurnPhase(ctx)
		if err != nil {
			return origin, err
		}
		if cancel {
			break
		}
		if ctx.Model.IsDone() {
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
