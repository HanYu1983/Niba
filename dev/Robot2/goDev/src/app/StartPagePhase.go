package app

import "app/tool/ui_data"

func StartPagePhase(origin ui_data.UI) (ui_data.UI, error) {
	var err error
	ctx := origin
	ctx.Actives = ui_data.AssocIntBool(ctx.Actives, ui_data.PageStart, true)
Menu:
	for {
		focus := ctx.Focus[ui_data.PageStart]
		menu := ctx.Menus[ui_data.PageStart][focus]
		var selection string
		var cancel, tab bool
		ctx, selection, cancel, tab, err = Menu1DStep(ctx, ui_data.PageStart, menu)
		if err != nil {
			return origin, err
		}
		if tab {
			continue
		}
		if cancel {
			break Menu
		}
		switch selection {
		case ui_data.MenuOptionNewGame:
			ctx.Actives = ui_data.AssocIntBool(ctx.Actives, ui_data.PageStart, false)
			ctx, err = LobbyPagePhase(ctx)
			if err != nil {
				return origin, err
			}
		}
	}
	ctx.Actives = ui_data.AssocIntBool(ctx.Actives, ui_data.PageStart, false)
	return ctx, nil
}
