package app

import (
	"app/tool/uidata"
	"fmt"
)

func Menu1DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	fmt.Println("Menu1DStep")
	var err error
	ctx := origin
	if _, has := ctx.Menu1Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu1D: %v", menuID)
	}
AskCommand:
	for {
		view.Render(ctx)
		fmt.Println("Menu1DStep:AskCommand")
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, false, err
		}
		// fmt.Printf("%+v\n", cmd)
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeArrowUp, uidata.KeyCodeArrowLeft:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor--
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeArrowDown, uidata.KeyCodeArrowRight:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor++
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeTab:
				return ctx, "", false, true, nil
			case uidata.KeyCodeSpace:
				break AskCommand
			case uidata.KeyCodeEsc:
				return origin, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu1Ds[menuID]
	return ctx, menu.Options[menu.Cursor], false, false, nil
}
