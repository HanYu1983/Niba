package app

import (
	"app/tool/data"
	"app/tool/ui_data"
)

func Menu1DStep(origin ui_data.UI, id int) (ui_data.UI, string, bool, error) {
	var err error
	ctx := origin
	view.Render(origin)
AskCommand:
	for {
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, err
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case data.KeyCodeArrowUp, data.KeyCodeArrowLeft:
				menu := ctx.Menu1Ds[id]
				menu.Cursor--
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, id, menu)
			case data.KeyCodeArrowDown, data.KeyCodeArrowRight:
				menu := ctx.Menu1Ds[id]
				menu.Cursor++
				ctx.Menu1Ds = ui_data.AssocIntMenu1D(ctx.Menu1Ds, id, menu)
			case data.KeyCodeSpace:
				break AskCommand
			case data.KeyCodeEsc:
				return origin, "", true, nil
			}
		}
	}
	menu := ctx.Menu1Ds[id]
	return ctx, menu.Options[menu.Cursor], false, nil
}
