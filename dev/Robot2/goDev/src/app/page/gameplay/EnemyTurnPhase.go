package gameplay

import (
	"app/tool/def"
	"app/tool/uidata"
	"fmt"
)

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	fmt.Println("EnemyTurnPhase start")
	model := def.Model
	model.Push()
	defer model.Pop()
	fmt.Println("EnemyTurnPhase start")
	return origin, true, nil
}
