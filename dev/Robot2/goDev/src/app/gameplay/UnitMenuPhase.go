package gameplay

import (
	"app/common"
	"app/tool/uidata"
	"fmt"
)

func CreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, error) {
	fmt.Printf("UnitMenuPhase start %v\n", unitID)
	ctx := origin
	if robot, is := model.QueryGameplayRobots()[unitID]; is {
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		if err != nil {
			return origin, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, true)
	WaitMenu:
		for {
			var cancel, tab bool
			ctx, _, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
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
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, false)
	}
	if item, is := model.QueryGameplayItems()[unitID]; is {
		// append menu
		ctx, err := CreateItemMenu(ctx, item.ID)
		if err != nil {
			return origin, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
	WaitItemMenu:
		for {
			var cancel, tab bool
			var selection string
			ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageGameplay, uidata.Menu1DSystemMenu)
			if err != nil {
				return origin, err
			}
			if tab {
				continue
			}
			if cancel {
				break WaitItemMenu
			}
			var _ = selection
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	}
	return origin, nil
}
