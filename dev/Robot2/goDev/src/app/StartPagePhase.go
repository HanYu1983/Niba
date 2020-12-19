package app

import "app/tool/uidata"

func StartPagePhase(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, true)
Menu:
	for {
		focus := ctx.Focus[uidata.PageStart]
		menu := ctx.Menus[uidata.PageStart][focus]
		var selection string
		var cancel, tab bool
		ctx, selection, cancel, tab, err = Menu1DStep(ctx, uidata.PageStart, menu)
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
		case uidata.MenuOptionNewGame:
			ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, false)
			ctx, err = LobbyPagePhase(ctx)
			if err != nil {
				return origin, err
			}
		}
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, false)
	return ctx, nil
}
