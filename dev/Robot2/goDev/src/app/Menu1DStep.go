package app

import (
	"app/tool/ui_data"
)

func Menu1DStep(origin ui_data.UI, pageID int, menuID int) (ui_data.UI, string, bool, bool, error) {
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
		case ui_data.CommandKeyDown:
			switch detail.KeyCode {
			case ui_data.KeyCodeArrowUp, ui_data.KeyCodeArrowLeft:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor--
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case ui_data.KeyCodeArrowDown, ui_data.KeyCodeArrowRight:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor++
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case ui_data.KeyCodeTab:
				return ctx, "", false, true, nil
			case ui_data.KeyCodeSpace:
				break AskCommand
			case ui_data.KeyCodeEsc:
				return origin, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu1Ds[menuID]
	return ctx, menu.Options[menu.Cursor], false, false, nil
}
