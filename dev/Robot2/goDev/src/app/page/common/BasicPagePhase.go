package common

import (
	"app/tool/uidata"
	"fmt"
)

func BasicPagePhase(
	origin uidata.UI,
	pageID int,
	onUpdate func(uidata.UI) (uidata.UI, error),
	onClickMenu1D func(uidata.UI, int, string, bool, bool) (uidata.UI, bool, error),
	onClickMenu2D func(uidata.UI, int, string, bool, bool) (uidata.UI, bool, error),
) (uidata.UI, error) {
	fmt.Println("BasicPagePhase")
	var err error
	ctx := origin
Menu:
	for {
		fmt.Println("BasicPagePhase: Loop")
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
	fmt.Println("BasicPagePhase: End")
	return ctx, nil
}
