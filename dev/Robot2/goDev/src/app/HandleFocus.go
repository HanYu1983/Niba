package app

import (
	"app/tool/uidata"
	"fmt"
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
		case uidata.KeyCodeTab:
			focus := ctx.Focus[pageID]
			focus = (focus + 1) % len(ctx.Menus[pageID])
			fmt.Printf("focus -> %v/%v\n", pageID, focus)
			ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
		}
	}
	return ctx, nil
}
