package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func CreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Model, err = ctx.Model.EnableRobotMenu(unitID, nil)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v) start", unitID))
	view := def.View
	var err error
	ctx := origin
	ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, false, err
	}
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	if robot, is := gameplayPage.Robots[unitID]; is {
		var _ = robot
		isRobotDone := ctx.GameplayPages[uidata.PageGameplay].Tags[unitID].IsDone
		if isRobotDone {
			return origin, false, nil
		}
		ctx, err = CreateRobotMenu(ctx, unitID)
		if err != nil {
			return origin, false, err
		}
		var cancel, tab bool
		var selection string
	MENU2D_STEP:
		for {
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {

				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				return origin, cancel, nil
			}
			break
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage = ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			if invalidStr, has := gameplayPage.RobotMenu.InvalidWeapons[weaponID]; has {
				view.Alert(invalidStr)
				goto MENU2D_STEP
			}
		SELECT_UNIT_STEP:
			var targetID string
			ctx, targetID, cancel, err = SelectUnitStep(ctx, unitID, func(targetID string) error {
				return nil
			})
			if err != nil {
				return origin, false, err
			}
			if cancel {
				goto MENU2D_STEP
			}
			ctx, cancel, err = common.BattleMenuPhase(ctx, true, unitID, weaponID, targetID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				goto SELECT_UNIT_STEP
			}
		case protocol.RobotMenuFunctionTransform:
			transformID := selection
			ctx.Model, err = ctx.Model.RobotTransform(unitID, transformID)
			if err != nil {
				view.Alert(err.Error())
			}
			ctx, cancel, err = UnitMenuPhase(ctx, unitID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				return origin, cancel, nil
			}
		default:
			switch selection {
			case uidata.MenuOptionUnitDone:
				ctx.Model, err = ctx.Model.RobotDone(unitID)
				if err != nil {
					return origin, false, err
				}
			case uidata.MenuOptionMove:
				ctx, cancel, err = RobotMovePhase(ctx, unitID)
				if err != nil {
					return origin, false, err
				}
				if cancel {
					return origin, cancel, nil
				}
			case uidata.MenuOptionSkyGround:
				ctx.Model, err = ctx.Model.RobotSkyGround(unitID)
				if err != nil {
					view.Alert(err.Error())
				}
				ctx, cancel, err = UnitMenuPhase(ctx, unitID)
				if err != nil {
					return origin, false, err
				}
				if cancel {
					return origin, cancel, nil
				}
			}
		}
		ctx.Model, err = ctx.Model.DisableRobotMenu()
		if err != nil {
			return origin, false, err
		}
	}
	if item, is := gameplayPage.Items[unitID]; is {
		var _ = item
		// append menu
		ctx, err := CreateItemMenu(ctx, unitID)
		if err != nil {
			return origin, false, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
		var cancel, tab bool
		var selection string
		for {
			ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageGameplay, uidata.Menu1DSystemMenu)
			if err != nil {
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				return origin, cancel, nil
			}
			break
		}
		var _ = selection
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	}
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v) end", unitID))
	return origin, false, nil
}
