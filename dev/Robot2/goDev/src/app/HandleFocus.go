package app

import (
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
			focus = focus - 1
			if focus < 0 {
				focus = (focus + len(ctx.Menus[pageID])) % len(ctx.Menus[pageID])
			}
			ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
		case uidata.KeyCodeR:
			focus := ctx.Focus[pageID]
			focus = (focus + 1) % len(ctx.Menus[pageID])
			ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
		}
	}
	return ctx, nil
}
