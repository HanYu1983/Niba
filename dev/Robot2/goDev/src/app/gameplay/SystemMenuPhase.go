package gameplay

import (
	"app/tool/uidata"
	"fmt"
)

func SystemMenuPhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("UnitMenuPhase start")
	return origin, nil
}
