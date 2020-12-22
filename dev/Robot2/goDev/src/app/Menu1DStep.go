package app

import (
	"app/tool"
	"app/tool/uidata"
	"fmt"
)

func Menu1DStep(origin uidata.UI, pageID int, menuID int) (uidata.UI, string, bool, bool, error) {
	fmt.Println("Menu1DStep")
	var err error
	ctx := origin
	if _, has := ctx.Menu1Ds[menuID]; has == false {
		return origin, "", false, false, fmt.Errorf("not found menu1D: %v", menuID)
	}
AskCommand:
	for {
		Render(ctx)
		fmt.Println("Menu1DStep:AskCommand")
		cmd := view.AskCommand()
		if err != nil {
			return origin, "", false, false, err
		}
		fmt.Printf("%+v\n", cmd)
		ctx, err = HandleFocus(ctx, pageID, cmd)
		if err != nil {
			return origin, "", false, false, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeUp:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor = tool.Max(menu.Cursor-1, 0)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeDown:
				menu := ctx.Menu1Ds[menuID]
				menu.Cursor = tool.Min(menu.Cursor+1, menu.Limit-1)
				if menu.Cursor+menu.Offset >= len(menu.Options) {
					menu.Cursor = (len(menu.Options) % menu.Limit) - 1
				}
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeLeft:
				menu := ctx.Menu1Ds[menuID]
				menu.Offset = tool.Max(menu.Offset-menu.Limit, 0)
				ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
			case uidata.KeyCodeRight:
				menu := ctx.Menu1Ds[menuID]
				offset := menu.Offset + menu.Limit
				if offset < len(menu.Options) {
					if offset+menu.Cursor >= len(menu.Options) {
						menu.Cursor = (len(menu.Options) % menu.Limit) - 1
					}
					menu.Offset = offset
					ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
				}
			case uidata.KeyCodeR, uidata.KeyCodeL:
				return ctx, "", false, true, nil
			case uidata.KeyCodeEnter:
				break AskCommand
			case uidata.KeyCodeEsc:
				return origin, "", true, false, nil
			}
		}
	}
	menu := ctx.Menu1Ds[menuID]
	return ctx, menu.Options[menu.Cursor+menu.Offset], false, false, nil
}
