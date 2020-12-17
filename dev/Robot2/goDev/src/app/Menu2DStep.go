package app

import (
	"app/tool/data"
	"app/tool/ui_data"
)

func Menu2DStep(origin ui_data.UI, id int) (ui_data.UI, string, bool, error) {
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
				menu := ctx.Menu2Ds[id]
				menu.Cursor1--
				ctx.Menu2Ds = ui_data.AssocIntMenu2D(ctx.Menu2Ds, id, menu)
			case data.KeyCodeArrowDown, data.KeyCodeArrowRight:
				menu := ctx.Menu2Ds[id]
				menu.Cursor1++
				ctx.Menu2Ds = ui_data.AssocIntMenu2D(ctx.Menu2Ds, id, menu)
			case data.KeyCodeSpace:
				break AskCommand
			case data.KeyCodeEsc:
				return origin, "", true, nil
			}
		}
	}
	menu := ctx.Menu2Ds[id]
	return ctx, menu.Options[menu.Cursor1][menu.Cursor2[menu.Cursor1]], false, nil
}
