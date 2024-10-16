package common

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func Menu2DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	log.Log(protocol.LogCategoryPhase, "Menu2DStep", "start")
	var err error
	ctx := origin
	view := def.View
	if _, has := ctx.Menu2Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu2D: %v", menuID)
	}
AskCommand:
	for {
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, "", false, false, err
		}
		log.Log(protocol.LogCategoryPhase, "Menu2DStep", "AskCommand")
		cmd := view.AskCommand()
		log.Log(protocol.LogCategoryPhase, "Menu2DStep", fmt.Sprintf("cmd(%+v)\n", cmd))
		if err != nil {
			return origin, "", false, false, err
		}
		if cmd == nil {
			return origin, "", false, false, protocol.ErrTerminate
		}
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeUp:
				menu := ctx.Menu2Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor1--
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeDown:
				menu := ctx.Menu2Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor1++
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeLeft:
				menu := ctx.Menu2Ds[menuID]
				if menu.Cursor2 == nil {
					return origin, "", false, false, fmt.Errorf("[Menu2DStep] Cursor2 must not nil")
				}
				if len(menu.Options) == 0 {
					continue
				}
				if len(menu.Options[menu.Cursor1]) == 0 {
					continue
				}
				menu.Cursor2[menu.Cursor1] = helper.Max(0, menu.Cursor2[menu.Cursor1]-1)
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeRight:
				menu := ctx.Menu2Ds[menuID]
				if menu.Cursor2 == nil {
					return origin, "", false, false, fmt.Errorf("[Menu2DStep] Cursor2 must not nil")
				}
				if len(menu.Options) == 0 {
					continue
				}
				if len(menu.Options[menu.Cursor1]) == 0 {
					continue
				}
				menu.Cursor2[menu.Cursor1] = helper.Min(len(menu.Options[menu.Cursor1])-1, menu.Cursor2[menu.Cursor1]+1)
				ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menuID, menu)
			case uidata.KeyCodeR, uidata.KeyCodeL:
				return ctx, "", false, true, nil
			case uidata.KeyCodeEnter:
				break AskCommand
			case uidata.KeyCodeCancel:
				return ctx, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu2Ds[menuID]
	if menu.Cursor2 == nil {
		return origin, "", false, false, fmt.Errorf("[Menu2DStep] Cursor2 must not nil")
	}
	// @TODO: index out of range
	return ctx, menu.Options[menu.Cursor1][menu.Cursor2[menu.Cursor1]], false, false, nil
}
