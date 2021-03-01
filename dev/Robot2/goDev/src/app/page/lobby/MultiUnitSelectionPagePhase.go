package lobby

import (
	"app/page/common"
	"app/page/gameplay"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
)

func MultiUnitSelectionPagePhase(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, true)
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageMultiUnitSelection,
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
				selection := ctx.Menu1Ds[menuID].Selection
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
				ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, false)
				ctx.Model, err = ctx.Model.New(protocol.NewGameplayWithSelection{Selection: selection})
				if err != nil {
					view.Alert(err.Error())
					return origin, false, nil
				}
				ctx, err = gameplay.GameLoop(ctx)
				if err != nil {
					return origin, cancel, err
				}
				reason := ctx.Model.IsDone()
				var _ = reason
				return ctx, true, nil
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, false)
	return ctx, nil
}
