package app

import "app/tool/ui_data"

func LobbyPagePhase(origin ui_data.UI) (ui_data.UI, error) {
	var err error
	ctx := origin
	ctx.LobbyPage.Active = true
	for {
		focusMenu := ctx.LobbyPage.Menus[ctx.LobbyPage.FocusMenu]
		var selection string
		var cancel bool
		ctx, selection, cancel, err = Menu1DStep(ctx, focusMenu)
		if err != nil {
			return origin, err
		}
		if cancel {
			continue
		}
		switch selection {
		case ui_data.MenuOptionStartGameplay:
			break
		}
	}
	ctx.LobbyPage.Active = false
	return ctx, nil
}
