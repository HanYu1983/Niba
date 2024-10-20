package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func OnDisableLineBattleMenu(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnDisableLineBattleMenu", "start")
	ctx := origin
	_model := ctx.Model.(Model)
	_model.App.Gameplay.HitMarks = map[string]protocol.HitMark{}
	_model.App.Gameplay.MapAttackRange = nil
	// apply
	ctx.Model = _model
	ctx, err := OnDisableRobotMenu(ctx)
	if err != nil {
		return origin, err
	}
	log.Log(protocol.LogCategoryInfo, "OnDisableLineBattleMenu", "end")
	return ctx, nil
}
