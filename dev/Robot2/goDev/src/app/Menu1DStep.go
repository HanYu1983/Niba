package app

import (
	"app/tool/ui_data"
)

func Menu1DStep(origin ui_data.UI, id int) (ui_data.UI, string, bool, error) {
	var err error
	ctx := origin
AskCommand:
	for {
		view.Render(ctx)
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, err
		}
		switch detail := cmd.(type) {
		case ui_data.CommandKeyDown:
			switch detail.KeyCode {
			case ui_data.KeyCodeArrowUp, ui_data.KeyCodeArrowLeft:
				menu := ctx.Menu1Ds[id]
				menu.Cursor--
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, id, menu)
			case ui_data.KeyCodeArrowDown, ui_data.KeyCodeArrowRight:
				menu := ctx.Menu1Ds[id]
				menu.Cursor++
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, id, menu)
			case ui_data.KeyCodeSpace:
				break AskCommand
			case ui_data.KeyCodeEsc:
				return origin, "", true, nil
			}
		}
	}
	menu := ctx.Menu1Ds[id]
	return ctx, menu.Options[menu.Cursor], false, nil
}
