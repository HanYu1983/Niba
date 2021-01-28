package common

import (
	"app/tool"
	"app/tool/def"
	"app/tool/uidata"
	"fmt"
)

func Menu1DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	fmt.Println("Menu1DStep")
	var err error
	ctx := origin
	view := def.View
	if _, has := ctx.Menu1Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu1D: %v", menuID)
	}
AskCommand:
	for {
		ctx, err = ObserveMenu(ctx, menuID)
		if err != nil {
			return origin, "", false, false, err
		}
		view.Render(ctx)
		fmt.Println("Menu1DStep:AskCommand")
		cmd := view.AskCommand()
		fmt.Printf("Menu1DStep:%+v\n", cmd)
		if cmd == nil {
			return ctx, "", true, false, nil
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
				menu.Cursor = tool.Max(menu.Cursor-1, 0)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeDown:
				menu := ctx.Menu1Ds[menuID]
				if len(menu.Options) == 0 {
					continue
				}
				menu.Cursor = tool.Min(menu.Cursor+1, len(menu.Options)-1)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeLeft:
				menu := ctx.Menu1Ds[menuID]
				menu.Offset = tool.Max(menu.Offset-menu.Limit, 0)
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
					fmt.Println("沒有任何Options, 當成切換Focus")
					focus := ctx.Focus[pageID]
					focus, over := tool.Clamp(focus+1, 0, len(ctx.Menus[pageID]))
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
					fmt.Printf("please init Selection field. Menu(%v)\n", menuID)
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
