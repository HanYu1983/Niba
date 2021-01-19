package title

import (
	"app/page/common"
	"app/page/lobby"
	"app/tool/uidata"
	"fmt"
)

func StartPagePhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("StartPagePhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, true)
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageStart,
		func(origin uidata.UI) (uidata.UI, error) {
			return origin, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			switch selection {
			case uidata.MenuOptionNewGame:
				ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, false)
				ctx, err = lobby.LobbyPagePhase(ctx)
				if err != nil {
					return origin, cancel, err
				}
				ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, true)
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return origin, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageStart, false)
	return ctx, nil
}
