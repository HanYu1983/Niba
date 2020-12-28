package app

import (
	"app/tool/uidata"
	"fmt"
)

func AssocPhase(origin uidata.UI, pageID int) (uidata.UI, error) {
	fmt.Println("AssocPhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, true)
	leftMapping := map[int]int{
		uidata.PageAssocRobotToPilot: uidata.Menu1DRobotPilotListMenu,
	}
	ctx, err = BasicPagePhase(
		ctx,
		pageID,
		func(origin uidata.UI) (uidata.UI, error) {
			ctx := origin
			ctx.Info.RobotIDByWeaponID = model.QueryRobotIDByWeaponID()
			ctx.Info.RobotIDByWeaponID = model.QueryRobotIDByWeaponID()
			ctx.Info.RobotIDByComponentID = model.QueryRobotIDByComponentID()
			return ctx, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[pageID][focus]
			switch menuID {
			case uidata.Menu1DRobotPilotListMenu, uidata.Menu1DWeaponRobotListMenu, uidata.Menu1DComponentRobotListMenu:
				if cancel {
					return ctx, cancel, nil
				}
				ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
			case uidata.Menu1DPilotListMenu, uidata.Menu1DRobotListMenu:
				if cancel {
					return ctx, cancel, nil
				}
				leftMenu := ctx.Menu1Ds[leftMapping[pageID]]
				middleMenu := ctx.Menu1Ds[uidata.Menu1DAssocOrDisMenu]
				leftSelection := leftMenu.Options[leftMenu.Cursor]
				middleSelection := middleMenu.Options[middleMenu.Cursor]
				rightSelection := selection
				switch pageID {
				case uidata.PageAssocRobotToPilot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						model.AssocRobotPilot(leftSelection, rightSelection)
					case uidata.MenuOptionDissoc:
						model.DissocRobotPilot(leftSelection)
					default:
						return origin, cancel, fmt.Errorf("you must select option: %v", middleSelection)
					}
				case uidata.PageAssocWeaponToRobot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						model.AssocWeaponRobot(leftSelection, rightSelection)
					case uidata.MenuOptionDissoc:
						model.DissocWeaponRobot(leftSelection)
					default:
						return origin, cancel, fmt.Errorf("you must select option: %v", middleSelection)
					}
				case uidata.PageAssocComponentToRobot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						model.AssocComponentRobot(leftSelection, rightSelection)
					case uidata.MenuOptionDissoc:
						model.DissocComponentRobot(leftSelection)
					default:
						return origin, cancel, fmt.Errorf("you must select option: %v", middleSelection)
					}
				default:
					return origin, cancel, fmt.Errorf("you must have page: %v", pageID)
				}
			default:
				if cancel {
					return ctx, cancel, nil
				}
				switch selection {
				case uidata.MenuOptionAssoc, uidata.MenuOptionDissoc:
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
				}
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, false)
	return origin, nil
}
