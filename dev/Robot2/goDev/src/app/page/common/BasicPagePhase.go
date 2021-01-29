package common

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func BasicPagePhase(
	origin uidata.UI,
	pageID int,
	onUpdate func(uidata.UI) (uidata.UI, error),
	onClickMenu1D func(uidata.UI, int, string, bool, bool) (uidata.UI, bool, error),
	onClickMenu2D func(uidata.UI, int, string, bool, bool) (uidata.UI, bool, error),
) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "BasicPagePhase", "start")
	var err error
	ctx := origin
Menu:
	for {
		log.Log(protocol.LogCategoryPhase, "BasicPagePhase", "onUpdate")
		ctx, err = onUpdate(ctx)
		if err != nil {
			return origin, err
		}
		focus := ctx.Focus[pageID]
		menuID := ctx.Menus[pageID][focus]
		if _, is := ctx.Menu1Ds[menuID]; is {
			var selection string
			var cancel, tab bool
			ctx, selection, cancel, tab, err = Menu1DStep(ctx, pageID, menuID)
			if err != nil {
				return origin, err
			}
			if tab {
				continue
			}
			ctx, cancel, err = onClickMenu1D(ctx, focus, selection, cancel, tab)
			if err != nil {
				return origin, err
			}
			if cancel {
				break Menu
			}
		} else if _, is := ctx.Menu2Ds[menuID]; is {
			var selection string
			var cancel, tab bool
			ctx, selection, cancel, tab, err = Menu2DStep(ctx, uidata.PageLobby, menuID)
			if err != nil {
				return origin, err
			}
			if tab {
				continue
			}
			ctx, cancel, err = onClickMenu2D(ctx, focus, selection, cancel, tab)
			if err != nil {
				return origin, err
			}
			if cancel {
				break Menu
			}
		} else {
			return origin, fmt.Errorf("component not found: %v", menuID)
		}
	}
	log.Log(protocol.LogCategoryPhase, "BasicPagePhase", "end")
	return ctx, nil
}
