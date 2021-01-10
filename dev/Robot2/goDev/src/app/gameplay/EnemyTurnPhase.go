package gameplay

import "app/tool/uidata"

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, error) {
	model.Push()
	defer model.Pop()
	return origin, nil
}
