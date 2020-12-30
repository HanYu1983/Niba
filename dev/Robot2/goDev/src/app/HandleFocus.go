package app

import (
	"app/tool"
	"app/tool/uidata"
)

func HandleFocus(origin uidata.UI, pageID int, cmd interface{}) (uidata.UI, error) {
	ctx := origin
	if _, has := ctx.Focus[pageID]; has == false {
		return origin, nil
	}
	if _, has := ctx.Menus[pageID]; has == false {
		return origin, nil
	}
	switch detail := cmd.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeL:
			focus := ctx.Focus[pageID]
			focus, isOver := tool.Clamp(focus-1, 0, len(ctx.Menus[pageID]))
			if isOver {
				focus = len(ctx.Menus[pageID]) - 1
			}
			ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
		case uidata.KeyCodeR:
			focus := ctx.Focus[pageID]
			focus, isOver := tool.Clamp(focus+1, 0, len(ctx.Menus[pageID]))
			if isOver {
				focus = 0
			}
			ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
		}
	}
	return ctx, nil
}
