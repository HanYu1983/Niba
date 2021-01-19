package gameplay

import (
	"app/tool/uidata"
	"fmt"
)

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("EnemyTurnPhase start")
	model.Push()
	defer model.Pop()
	fmt.Println("EnemyTurnPhase start")
	return origin, nil
}
