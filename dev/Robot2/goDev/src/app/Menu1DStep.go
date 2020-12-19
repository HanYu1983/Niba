package app

import (
	"app/tool/uidata"
)

func Menu1DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	var err error
	ctx := origin
AskCommand:
	for {
		view.Render(ctx)
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
