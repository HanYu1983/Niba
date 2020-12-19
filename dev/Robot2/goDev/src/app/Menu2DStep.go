package app

import (
	"app/tool/uidata"
)

func Menu2DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
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
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeArrowUp, uidata.KeyCodeArrowLeft:
				menu := ctx.Menu2Ds[menuID]
				menu.Cursor1--
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeArrowDown, uidata.KeyCodeArrowRight:
				menu := ctx.Menu2Ds[menuID]
				menu.Cursor1++
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeTab:
				return ctx, "", false, true, nil
			case uidata.KeyCodeSpace:
				break AskCommand
			case uidata.KeyCodeEsc:
				return origin, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu2Ds[menuID]
	return ctx, menu.Options[menu.Cursor1][menu.Cursor2[menu.Cursor1]], false, false, nil
}
