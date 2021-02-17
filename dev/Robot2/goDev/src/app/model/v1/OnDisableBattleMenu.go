package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnDisableBattleMenu(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "DisableBattleMenu", "start")
	ctx := origin
	_model := ctx.Model.(Model)
	_model.App.Gameplay.BattleMenu.Active = false
	ctx.Model = _model
	ctx, err := OnDisableRobotMenu(ctx)
	if err != nil {
		return origin, err
	}
	log.Log(protocol.LogCategoryDetail, "DisableBattleMenu", fmt.Sprintf("after RobotMenu(%v)", ctx.Model.(Model).App.Gameplay.RobotMenu))
	log.Log(protocol.LogCategoryPhase, "DisableBattleMenu", "end")
	return ctx, nil
}
