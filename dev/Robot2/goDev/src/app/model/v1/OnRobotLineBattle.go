package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func OnRobotLineBattle(origin uidata.UI, robotID string, weaponID string, targetPosition protocol.Position) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnRobotLineBattle", "start")
	ctx := origin
	log.Log(protocol.LogCategoryPhase, "OnRobotLineBattle", "end")
	return ctx, nil
}
