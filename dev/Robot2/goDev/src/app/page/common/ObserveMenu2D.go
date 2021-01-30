package common

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/uidata"
)

func ObserveMenu2D(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	model := def.Model
	menu, has := ctx.Menu2Ds[menuID]
	if has == false {
		return origin, nil
	}
	options := [][]string{}
	switch menuID {
	case uidata.Menu2DUnitMenu:
		unitMenuModel := model.GetRobotMenu()
		if unitMenuModel.Active {
			options = unitMenuModel.Options
			gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
			gameplayPage.RobotMenu = unitMenuModel
			ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
		}
	}
	if menu.Cursor2 == nil || len(menu.Cursor2) != len(options) {
		menu.Cursor2 = make([]int, len(options))
	}
	menu.Options = options
	if len(options) > 0 {
		menu.Cursor1 = helper.Max(0, helper.Min(len(options)-1, menu.Cursor1))
		if len(options[menu.Cursor1]) > 0 {
			menu.Cursor2[menu.Cursor1] = helper.Max(0, helper.Min(len(options[menu.Cursor1])-1, menu.Cursor2[menu.Cursor1]))
		}
	}
	ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
	return ctx, nil
}
