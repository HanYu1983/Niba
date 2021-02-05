package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func OnPlayerTurnStart(origin uidata.UI, player protocol.Player) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnPlayerTurnStart", "start")
	ctx := origin
	log.Log(protocol.LogCategoryPhase, "OnPlayerTurnStart", "start")
	return ctx, nil
}
