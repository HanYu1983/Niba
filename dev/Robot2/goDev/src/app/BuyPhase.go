package app

import (
	"app/tool/uidata"
	"fmt"
)

func BuyPhase(origin uidata.UI, pageID int) (uidata.UI, error) {
	fmt.Println("BuyPhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, true)
	ctx, err = BasicPagePhase(
		ctx,
		pageID,
		func(origin uidata.UI) (uidata.UI, error) {
			return PreparePage(origin, pageID)
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[pageID][focus]
			switch menuID {
			case uidata.Menu1DBuyOrSellOrElseMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				switch selection {
				case uidata.MenuOptionCreateNew:
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
				case uidata.MenuOptionSell:
					fmt.Println("Sell")
				default:
					// ignore
				}
			case uidata.Menu1DRobotListMenu, uidata.Menu1DPilotListMenu, uidata.Menu1DWeaponListMenu, uidata.Menu1DComponentListMenu:
				if cancel {
					return ctx, cancel, nil
				}
				ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
			case uidata.Menu1DBuyRobotMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyRobot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyPilotMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyPilot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyWeaponMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyWeapon(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyComponentMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyComponent(selection)
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
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, false)
	fmt.Println("BuyPhase: End")
	return ctx, nil
}
