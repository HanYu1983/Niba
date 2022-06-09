package gameplay

import (
	"app/tool/uidata"
)

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	var ctx interface{} = origin
	ctx, cancel, err = origin.Model.OnEnemyTurnPhase(ctx)
	return ctx.(uidata.UI), cancel, err
}
