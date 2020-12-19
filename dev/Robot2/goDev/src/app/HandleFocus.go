package app

import (
	"app/tool/ui_data"
)

func HandleFocus(origin ui_data.UI, pageID int, cmd interface{}) (ui_data.UI, error) {
	ctx := origin
	if _, has := ctx.Focus[pageID]; has == false {
		return origin, nil
	}
	if _, has := ctx.Menus[pageID]; has == false {
		return origin, nil
	}
	switch detail := cmd.(type) {
	case ui_data.CommandKeyDown:
		switch detail.KeyCode {
		case ui_data.KeyCodeTab:
			focus := ctx.Focus[pageID]
			focus = (focus + 1) % len(ctx.Menus[pageID])
			ctx.Focus = ui_data.AssocIntInt(ctx.Focus, pageID, focus)
		}
	}
	return ctx, nil
}
