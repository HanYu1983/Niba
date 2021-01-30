package common

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func Menu1DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	log.Log(protocol.LogCategoryPhase, "Menu1DStep", "start")
	var err error
	ctx := origin
	view := def.View
	if _, has := ctx.Menu1Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu1D: %v", menuID)
	}
AskCommand:
	for {
		ctx, err = ObservePage(ctx, pageID)
		if err != nil {
			return origin, "", false, false, err
		}
		view.Render(ctx)
		log.Log(protocol.LogCategoryPhase, "Menu1DStep", "AskCommand")
		cmd := view.AskCommand()
		log.Log(protocol.LogCategoryPhase, "Menu1DStep", fmt.Sprintf("cmd(%+v)\n", cmd))
		if cmd == nil {
			return ctx, "", false, false, protocol.ErrTerminate
		}
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeUp:
				menu := ctx.Menu1Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor = helper.Max(menu.Cursor-1, 0)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeDown:
				menu := ctx.Menu1Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor = helper.Min(menu.Cursor+1, len(menu.Options)-1)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeLeft:
				menu := ctx.Menu1Ds[menuID]
				menu.Offset = helper.Max(menu.Offset-menu.Limit, 0)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeRight:
				menu := ctx.Menu1Ds[menuID]
				menu.Offset = menu.Offset + menu.Limit
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeR, uidata.KeyCodeL:
				return ctx, "", false, true, nil
			case uidata.KeyCodeEnter:
				menu := ctx.Menu1Ds[menuID]
				if len(menu.Options) == 0 {
					log.Log(protocol.LogCategoryDetail, "Menu1DStep", "沒有任何Options, 當成切換Focus")
					focus := ctx.Focus[pageID]
					focus, over := helper.Clamp(focus+1, 0, len(ctx.Menus[pageID]))
					if over {
						focus = focus % len(ctx.Menus[pageID])
					}
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, focus)
					return ctx, "", false, true, nil
				}
				break AskCommand
			case uidata.KeyCodeCancel:
				return ctx, "", true, false, nil
			case uidata.KeyCodeSubEnter:
				menu := ctx.Menu1Ds[menuID]
				if menu.Selection == nil {
					log.Log(protocol.LogCategoryWarning, "Menu1DStep", fmt.Sprintf("please init Selection field. Menu(%v)\n", menuID))
					continue
				}
				idx := menu.Cursor
				if idx < 0 || idx >= len(menu.Options) {
					return ctx, "", false, false, fmt.Errorf("Menu1DStep index out of range. Menu(%v) (%v/%v)", menuID, idx, len(menu.Options))
				}
				menu.Selection[menu.Options[idx]] = !menu.Selection[menu.Options[idx]]
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			}
		}
	}
	menu := ctx.Menu1Ds[menuID]
	idx := menu.Cursor
	if idx < 0 || idx >= len(menu.Options) {
		return ctx, "", false, false, fmt.Errorf("Menu1DStep index out of range. Menu(%v) (%v/%v)", menuID, idx, len(menu.Options))
	}
	return ctx, menu.Options[idx], false, false, nil
}
