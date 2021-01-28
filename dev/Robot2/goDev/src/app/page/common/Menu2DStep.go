package common

import (
	"app/tool/def"
	"app/tool/uidata"
	"fmt"
)

func Menu2DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	fmt.Println("Menu2DStep")
	var err error
	ctx := origin
	view := def.View
	if _, has := ctx.Menu2Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu2D: %v", menuID)
	}
AskCommand:
	for {
		view.Render(ctx)
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, false, err
		}
		if cmd == nil {
			return origin, "", true, false, nil
		}
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeUp, uidata.KeyCodeLeft:
				menu := ctx.Menu2Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor1--
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeDown, uidata.KeyCodeRight:
				menu := ctx.Menu2Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor1++
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeR, uidata.KeyCodeL:
				return ctx, "", false, true, nil
			case uidata.KeyCodeEnter:
				break AskCommand
			case uidata.KeyCodeCancel:
				return ctx, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu2Ds[menuID]
	return ctx, menu.Options[menu.Cursor1][menu.Cursor2[menu.Cursor1]], false, false, nil
}
