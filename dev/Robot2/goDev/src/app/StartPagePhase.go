package app

import "app/tool/ui_data"

func StartPagePhase(origin ui_data.UI) (ui_data.UI, error) {
	var err error
	ctx := origin
	ctx.StartPage.Active = true
	for {
		focusMenu := ctx.StartPage.Menus[ctx.StartPage.FocusMenu]
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
		case ui_data.MenuOptionNewGame:
			ctx.StartPage.Active = false
			ctx, err = LobbyPagePhase(ctx)
			if err != nil {
				return origin, err
			}
		}
	}
	ctx.StartPage.Active = false
	return ctx, nil
}

var (
	StartUI = StartPagePhase
)
