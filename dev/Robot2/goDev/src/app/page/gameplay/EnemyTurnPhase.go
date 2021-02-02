package gameplay

import (
	"app/tool/def"
	"app/tool/uidata"
)

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	model := def.Model
	var err error
	var cancel bool
	var ctx interface{} = origin
	ctx, cancel, err = model.EnemyTurnPhase(ctx)
	return ctx.(uidata.UI), cancel, err
}
