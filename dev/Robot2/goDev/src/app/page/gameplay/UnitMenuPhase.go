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

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, error) {
	fmt.Printf("UnitMenuPhase start %v\n", unitID)
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	ctx := origin
	if robot, is := model.GetGameplayRobots()[unitID]; is {
		ctx, err := CreateRobotMenu(ctx, robot.ID)
		if err != nil {
			return origin, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, true)
	WaitMenu:
		for {
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				model.Reset()
				return origin, err
			}
			view.Render(ctx)
			var cancel, tab bool
			var selection string
			ctx, selection, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			fmt.Printf("selection: %v %v %v %v\n", selection, cancel, tab, err)
			if err != nil {
				model.Reset()
				return origin, err
			}
			if tab {
				continue
			}
			if cancel {
				break WaitMenu
			}
			topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]

			fmt.Printf("gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1]: %v\n", gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1])

			switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
			case protocol.RobotMenuFunctionWeapon:
				weaponID := selection
				var targetID string
				ctx, targetID, cancel, err = SelectUnitStep(ctx, unitID, func(targetID string) error {
					return nil
				})
				if err != nil {
					model.Reset()
					return origin, err
				}
				if cancel {
					continue
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
					ctx, _, err = RobotMovePhase(ctx, unitID)
					if err != nil {
						view.Alert(err.Error())
						continue
					}
				case uidata.MenuOptionSkyGround:
					err = model.RobotSkyGround(unitID)
					if err != nil {
						view.Alert(err.Error())
						continue
					}
				}
			}
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, false)
	}
	if item, is := model.GetGameplayItems()[unitID]; is {
		// append menu
		ctx, err := CreateItemMenu(ctx, item.ID)
		if err != nil {
			model.Reset()
			return origin, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
	WaitItemMenu:
		for {
			var cancel, tab bool
			var selection string
			ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageGameplay, uidata.Menu1DSystemMenu)
			if err != nil {
				model.Reset()
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
