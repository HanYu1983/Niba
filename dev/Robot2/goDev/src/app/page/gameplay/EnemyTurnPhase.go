package gameplay

import (
	"app/tool/def"
	"app/tool/uidata"
)

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, error) {
	model := def.Model
	model.Push()
	defer model.Pop()
	return origin, nil
}
