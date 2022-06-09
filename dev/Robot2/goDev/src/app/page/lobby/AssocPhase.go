package lobby

import (
	"app/page/common"
	"app/tool"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func AssocPhase(origin uidata.UI, pageID int) (uidata.UI, error) {
	view := def.View
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, true)
	leftMapping := map[int]int{
		uidata.PageAssocRobotToPilot:     uidata.Menu1DRobotPilotListMenu,
		uidata.PageAssocWeaponToRobot:    uidata.Menu1DWeaponRobotListMenu,
		uidata.PageAssocComponentToRobot: uidata.Menu1DComponentRobotListMenu,
	}
	ctx, err = common.BasicPagePhase(
		ctx,
		pageID,
		false,
		func(origin uidata.UI) (uidata.UI, error) {
			var err error
			ctx := origin
			ctx, err = view.Render(ctx)
			if err != nil {
				return origin, err
			}
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
				focus, _ := helper.Clamp(ctx.Focus[pageID]+1, 0, len(ctx.Menus[pageID]))
				ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
			case uidata.Menu1DPilotListMenu, uidata.Menu1DRobotListMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				leftMenu := ctx.Menu1Ds[leftMapping[pageID]]
				middleMenu := ctx.Menu1Ds[uidata.Menu1DAssocOrDisMenu]
				leftSelection, outOfRange := tool.TryGetString(leftMenu.Options, leftMenu.Cursor)
				log.Log(protocol.LogCategoryDetail, "AssocPhase", fmt.Sprintf("leftSelection(%v)", leftSelection))
				if outOfRange != nil {
					log.Log(protocol.LogCategoryWarning, "AssocPhase", outOfRange.Error())
					return ctx, cancel, nil
				}
				middleSelection, outOfRange := tool.TryGetString(middleMenu.Options, middleMenu.Cursor)
				log.Log(protocol.LogCategoryDetail, "AssocPhase", fmt.Sprintf("middleSelection(%v)", middleSelection))
				if outOfRange != nil {
					log.Log(protocol.LogCategoryWarning, "AssocPhase", outOfRange.Error())
					return ctx, cancel, nil
				}
				rightSelection := selection
				log.Log(protocol.LogCategoryDetail, "AssocPhase", fmt.Sprintf("rightSelection(%v)", rightSelection))
				switch pageID {
				case uidata.PageAssocRobotToPilot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						ctx.Model, err = ctx.Model.AssocRobotPilot(leftSelection, rightSelection)
						if err != nil {
							return ctx, false, err
						}
					case uidata.MenuOptionDissoc:
						ctx.Model, err = ctx.Model.DissocRobotPilot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					default:
						return origin, cancel, fmt.Errorf("AssocPhase: you must select option: %v", middleSelection)
					}
				case uidata.PageAssocWeaponToRobot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						ctx.Model, err = ctx.Model.AssocWeaponRobot(leftSelection, rightSelection)
						if err != nil {
							return ctx, false, err
						}
					case uidata.MenuOptionDissoc:
						ctx.Model, err = ctx.Model.DissocWeaponRobot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					default:
						return origin, cancel, fmt.Errorf("AssocPhase: you must select option: %v", middleSelection)
					}
				case uidata.PageAssocComponentToRobot:
					switch middleSelection {
					case uidata.MenuOptionAssoc:
						ctx.Model, err = ctx.Model.AssocComponentRobot(leftSelection, rightSelection)
						if err != nil {
							return ctx, false, err
						}
					case uidata.MenuOptionDissoc:
						ctx.Model, err = ctx.Model.DissocComponentRobot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					default:
						return origin, cancel, fmt.Errorf("AssocPhase: you must select option: %v", middleSelection)
					}
				default:
					return origin, cancel, fmt.Errorf("AssocPhase: you must have page: %v", pageID)
				}
			case uidata.Menu1DAssocOrDisMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				switch selection {
				case uidata.MenuOptionAssoc:
					focus, _ := helper.Clamp(ctx.Focus[pageID]+1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
				case uidata.MenuOptionDissoc:
					leftMenu := ctx.Menu1Ds[leftMapping[pageID]]
					leftSelection, outOfRange := tool.TryGetString(leftMenu.Options, leftMenu.Cursor)
					if outOfRange != nil {
						log.Log(protocol.LogCategoryWarning, "AssocPhase", outOfRange.Error())
						return ctx, cancel, nil
					}
					switch pageID {
					case uidata.PageAssocRobotToPilot:
						ctx.Model, err = ctx.Model.DissocRobotPilot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					case uidata.PageAssocWeaponToRobot:
						ctx.Model, err = ctx.Model.DissocWeaponRobot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					case uidata.PageAssocComponentToRobot:
						ctx.Model, err = ctx.Model.DissocComponentRobot(leftSelection)
						if err != nil {
							return ctx, false, err
						}
					default:
						return origin, cancel, fmt.Errorf("AssocPhase: you must have page: %v", pageID)
					}
				}
			default:
				return origin, cancel, fmt.Errorf("AssocPhase: menu not found %v", menuID)
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
	return ctx, nil
}
