package gameplay

import (
	"app/tool/def"
	"app/tool/uidata"
	"fmt"
	"time"
)

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("GameLoop start")
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, true)
	for {
		view.Render(ctx)
		time.Sleep(time.Second)
		var cancel bool
		ctx, cancel, err = TurnPhase(ctx)
		if err != nil {
			model.Reset()
			return origin, err
		}
		if cancel {
			model.Reset()
			return origin, nil
		}
		if model.IsDone() {
			break
		}
		model.NextPlayer()
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, false)
	fmt.Println("GameLoop end")
	return ctx, nil
}
