package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func OnLineBattleMenuPhase(origin uidata.UI, isPlayerTurn bool, robotID string, weaponID string, targetPosition protocol.Position) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "OnLineBattleMenuPhase", "start")
	var err error
	ctx := origin
	view := def.View
	ctx, err = OnEnableLineBattleMenu(ctx, robotID, weaponID, targetPosition)
	if err != nil {
		return origin, false, err
	}
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, false, err
	}
	for {
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		var cancel, tab bool
		ctx, _, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, false, err
		}
		if tab {
			continue
		}
		if cancel {
			if isPlayerTurn {
				return origin, cancel, nil
			}
			continue
		}
		break
	}
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, false, err
	}
	ctx, _, err = OnRobotLineBattle(ctx, robotID, weaponID, targetPosition)
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryPhase, "OnLineBattleMenuPhase", "end")
	return ctx, false, nil
}
