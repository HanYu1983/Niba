package app

import (
	"app/tool/ui_data"
)

func Menu2DStep(origin ui_data.UI, pageID int, menuID int) (ui_data.UI, string, bool, bool, error) {
	var err error
	ctx := origin
AskCommand:
	for {
		view.Render(ctx)
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, false, err
		}
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case ui_data.CommandKeyDown:
			switch detail.KeyCode {
			case ui_data.KeyCodeArrowUp, ui_data.KeyCodeArrowLeft:
				menu := ctx.Menu2Ds[menuID]
				menu.Cursor1--
				ctx.Menu2Ds = ui_data.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case ui_data.KeyCodeArrowDown, ui_data.KeyCodeArrowRight:
				menu := ctx.Menu2Ds[menuID]
				menu.Cursor1++
				ctx.Menu2Ds = ui_data.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case ui_data.KeyCodeTab:
				return ctx, "", false, true, nil
			case ui_data.KeyCodeSpace:
				break AskCommand
			case ui_data.KeyCodeEsc:
				return origin, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu2Ds[menuID]
	return ctx, menu.Options[menu.Cursor1][menu.Cursor2[menu.Cursor1]], false, false, nil
}
