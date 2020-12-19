package app

import "app/tool/ui_data"

func LobbyPagePhase(origin ui_data.UI) (ui_data.UI, error) {
	var err error
	ctx := origin
	ctx.Actives = ui_data.AssocIntBool(ctx.Actives, ui_data.PageLobby, true)
Menu:
	for {
		focus := ctx.Focus[ui_data.PageLobby]
		menu := ctx.Menus[ui_data.PageLobby][focus]
		var selection string
		var cancel, tab bool
		ctx, selection, cancel, tab, err = Menu1DStep(ctx, ui_data.PageLobby, menu)
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
		case ui_data.MenuOptionStartGameplay:
			break
		}
	}
	ctx.Actives = ui_data.AssocIntBool(ctx.Actives, ui_data.PageLobby, false)
	return ctx, nil
}
