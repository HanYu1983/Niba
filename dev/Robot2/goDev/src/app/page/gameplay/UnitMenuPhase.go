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
	model := def.Model
	ctx := origin
	err := model.EnableRobotMenu(unitID, nil)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v)", unitID))
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		model.Reset()
		return origin, false, err
	}
	if robot, is := model.GetGameplayRobots()[unitID]; is {
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
		for {
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				model.Reset()
				return origin, cancel, nil
			}
			break
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			var targetID string
			ctx, targetID, cancel, err = SelectUnitStep(ctx, unitID, func(targetID string) error {
				return nil
			})
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if cancel {
				model.Reset()
				return origin, cancel, nil
			}
			ctx, cancel, err = BattleMenuPhase(ctx, true, unitID, weaponID, targetID)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if cancel {
				model.Reset()
				return origin, cancel, nil
			}
		case protocol.RobotMenuFunctionTransform:
			transformID := selection
			err = model.RobotTransform(unitID, transformID)
			if err != nil {
				view.Alert(err.Error())
			}
			ctx, cancel, err = UnitMenuPhase(ctx, unitID)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if cancel {
				model.Reset()
				return origin, cancel, nil
			}
		default:
			switch selection {
			case uidata.MenuOptionUnitDone:
				err = model.RobotDone(unitID)
				if err != nil {
					model.Reset()
					return origin, false, err
				}
			case uidata.MenuOptionMove:
				ctx, cancel, err = RobotMovePhase(ctx, unitID)
				if err != nil {
					model.Reset()
					return origin, false, err
				}
				if cancel {
					model.Reset()
					return ctx, cancel, nil
				}
			case uidata.MenuOptionSkyGround:
				err = model.RobotSkyGround(unitID)
				if err != nil {
					view.Alert(err.Error())
				}
				ctx, cancel, err = UnitMenuPhase(ctx, unitID)
				if err != nil {
					model.Reset()
					return origin, false, err
				}
				if cancel {
					model.Reset()
					return ctx, cancel, nil
				}
			}
		}
		model.DisableRobotMenu()
	}
	if item, is := model.GetGameplayItems()[unitID]; is {
		var _ = item
		// append menu
		ctx, err := CreateItemMenu(ctx, unitID)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
		var cancel, tab bool
		var selection string
		for {
			ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageGameplay, uidata.Menu1DSystemMenu)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				model.Reset()
				return ctx, cancel, nil
			}
			break
		}
		var _ = selection
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	}
	return origin, false, nil
}
