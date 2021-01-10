package gameplay

import (
	"app/common"
	"app/tool/uidata"
)

func CreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, error) {
	ctx := origin
	if robot, is := model.QueryGameplayRobots()[unitID]; is {
		// append menu
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			ctx, _, cancel, tab, err := common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				return origin, err
			}
			if tab {
				continue
			}
			if cancel {
				break WaitMenu
			}
			topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
			var _ = topMenu
		}
		// pop menu
		return ctx, nil
	}
	if item, is := model.QueryGameplayItems()[unitID]; is {
		// append menu
		ctx, err := CreateItemMenu(ctx, item.ID)
		if err != nil {
			return origin, err
		}
		ctx, selection, _, _, err := common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		var _ = selection
		// pop menu
		return ctx, nil
	}
	return origin, nil
}
