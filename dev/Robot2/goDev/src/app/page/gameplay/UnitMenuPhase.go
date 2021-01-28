package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
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
	fmt.Printf("[UnitMenuPhase] start %v\n", unitID)
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	ctx := origin
	if robot, is := model.GetGameplayRobots()[unitID]; is {
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		defer model.DisableRobotMenu()
		if err != nil {
			return origin, false, err
		}
	ContinueWhenClickTab:
		for {
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			view.Render(ctx)
			var cancel, tab bool
			var selection string
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
				var _ = targetID
				var _ = weaponID
			case protocol.RobotMenuFunctionTransform:
				transformID := selection
				err = model.RobotTransform(unitID, transformID)
				if err != nil {
					view.Alert(err.Error())
					continue
				}
			default:
				switch selection {
				case uidata.MenuOptionMove:
					ctx, cancel, err = RobotMovePhase(ctx, unitID)
					if err != nil {
						view.Alert(err.Error())
						continue
					}
					if cancel {
						model.Reset()
						return ctx, cancel, nil
					}
					break ContinueWhenClickTab
				case uidata.MenuOptionSkyGround:
					err = model.RobotSkyGround(unitID)
					if err != nil {
						view.Alert(err.Error())
						continue
					}
					break ContinueWhenClickTab
				}
			}
		}
	}
	if item, is := model.GetGameplayItems()[unitID]; is {
		// append menu
		ctx, err := CreateItemMenu(ctx, item.ID)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
	ContinueItemWhenClickTab:
		for {
			var cancel, tab bool
			var selection string
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
			var _ = selection
			break ContinueItemWhenClickTab
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	}
	return origin, false, nil
}
