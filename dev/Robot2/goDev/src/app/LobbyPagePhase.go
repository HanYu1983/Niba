package app

import "app/tool/uidata"

func LobbyPagePhase(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, true)
Menu:
	for {
		focus := ctx.Focus[uidata.PageLobby]
		menu := ctx.Menus[uidata.PageLobby][focus]
		var selection string
		var cancel, tab bool
		ctx, selection, cancel, tab, err = Menu1DStep(ctx, uidata.PageLobby, menu)
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
		case uidata.MenuOptionStartGameplay:
			break
		}
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, false)
	return ctx, nil
}
