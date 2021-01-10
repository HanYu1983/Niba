package gameplay

import (
	"app/tool/uidata"
)

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		ctx, err = TurnPhase(ctx)
		if err != nil {
			model.Reset()
			return origin, err
		}
		if model.IsDone() {
			break
		}
		model.NextPlayer()
	}
	return ctx, nil
}
