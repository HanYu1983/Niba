package app

import (
	"app/tool/uidata"
	"fmt"
)

func MultiUnitSelectionPagePhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("MultiUnitSelectionPagePhase")
	var err error
	ctx := origin
	ctx, err = PreparePage(ctx, uidata.PageMultiUnitSelection)
	if err != nil {
		return origin, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageMultiUnitSelection, true)
	ctx, err = BasicPagePhase(
		ctx,
		uidata.PageMultiUnitSelection,
		func(origin uidata.UI) (uidata.UI, error) {
			return origin, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[uidata.PageMultiUnitSelection][focus]
			switch menuID {
			case uidata.Menu1DMultiUnitSelectionMenu:
				selection := ctx.Menu1Ds[menuID].Selection
				var _ = selection
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
	fmt.Println("MultiUnitSelectionPagePhase: End")
	return ctx, nil
}
