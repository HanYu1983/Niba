package lobby

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/uidata"
	"fmt"
)

func BuyPhase(origin uidata.UI, pageID int) (uidata.UI, error) {
	view := def.View
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, true)
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
			case uidata.Menu1DBuyOrSellOrElseMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				switch selection {
				case uidata.MenuOptionCreateNew:
					focus, _ := helper.Clamp(ctx.Focus[pageID]+1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
				case uidata.MenuOptionSell:
					fmt.Println("Sell")
				default:
					// ignore
				}
			case uidata.Menu1DRobotListMenu, uidata.Menu1DPilotListMenu, uidata.Menu1DWeaponListMenu, uidata.Menu1DComponentListMenu:
				if cancel {
					return ctx, cancel, nil
				}
				focus, _ := helper.Clamp(ctx.Focus[pageID]+1, 0, len(ctx.Menus[pageID]))
				ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
			case uidata.Menu1DBuyRobotMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				ctx.Model, err = ctx.Model.BuyRobot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyPilotMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				ctx.Model, err = ctx.Model.BuyPilot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyWeaponMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				ctx.Model, err = ctx.Model.BuyWeapon(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyComponentMenu:
				if cancel {
					focus, _ := helper.Clamp(ctx.Focus[pageID]-1, 0, len(ctx.Menus[pageID]))
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, false, nil
				}
				ctx.Model, err = ctx.Model.BuyComponent(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return origin, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, false)
	return ctx, nil
}
