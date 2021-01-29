package gameplay

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func SystemMenuPhase(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "SystemMenuPhase", "start")
	log.Log(protocol.LogCategoryPhase, "SystemMenuPhase", "end")
	return origin, nil
}
