package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func ObserveMenu2D(origin uidata.UI, menuID int) (uidata.UI, error) {
	log.Log(protocol.LogCategoryRender, "ObserveMenu2D", "start")
	ctx := origin
	model := ctx.Model.(model)
	menu, has := ctx.Menu2Ds[menuID]
	if has == false {
		return origin, nil
	}
	options := [][]string{}
	switch menuID {
	case uidata.Menu2DUnitMenu:
		unitMenuModel, err := ObserveRobotMenu(model, GetRobotMenu(model))
		if err != nil {
			return origin, err
		}
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
		for i := 0; i < len(options); i++ {
			if len(options[i]) > 0 {
				menu.Cursor2[i] = helper.Max(0, helper.Min(len(options[i])-1, menu.Cursor2[i]))
			}
		}
	}
	ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
	log.Log(protocol.LogCategoryRender, "ObserveMenu2D", "end")
	return ctx, nil
}
