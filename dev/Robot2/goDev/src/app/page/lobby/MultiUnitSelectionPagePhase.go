package lobby

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func MultiUnitSelectionPagePhase(origin uidata.UI) (uidata.UI, map[string]bool, bool, error) {
	log.Log(protocol.LogCategoryPhase, "MultiUnitSelectionPagePhase", "start")
	var err error
	ctx := origin
	view := def.View
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, nil, false, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, true)
	var unitSelection map[string]bool
	var confirm bool
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageMultiUnitSelection,
		false,
		func(origin uidata.UI) (uidata.UI, error) {
			return view.Render(ctx)
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[uidata.PageMultiUnitSelection][focus]
			switch menuID {
			case uidata.Menu1DMultiUnitSelectionMenu:
				if cancel {
					return ctx, cancel, nil
				}
				unitSelection = ctx.Menu1Ds[menuID].Selection
				// {
				// 	cnt := 0
				// 	for _, sel := range selection {
				// 		if sel == false {
				// 			continue
				// 		}
				// 		cnt++
				// 	}
				// 	if cnt == 0 {
				// 		view.Alert("請選擇至少一機")
				// 		return origin, false, nil
				// 	}
				// }
				confirm = true
				return ctx, true, nil
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, nil, false, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, false)
	cancel := confirm == false
	log.Log(protocol.LogCategoryPhase, "MultiUnitSelectionPagePhase", "end")
	return ctx, unitSelection, cancel, nil
}
