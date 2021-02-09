package lobby

import (
	"app/page/common"
	"app/page/gameplay"
	"app/tool/uidata"
)

func MultiUnitSelectionPagePhase(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx, err = common.ObservePage(ctx, uidata.PageMultiUnitSelection)
	if err != nil {
		return origin, err
	}
	ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageMultiUnitSelection, true)
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageMultiUnitSelection,
		func(origin uidata.UI) (uidata.UI, error) {
			return common.ObservePage(ctx, uidata.PageMultiUnitSelection)
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
				var _ = selection
				ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageMultiUnitSelection, false)
				ctx, err = gameplay.GameLoop(ctx)
				if err != nil {
					return origin, cancel, err
				}
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
	ctx.Actives = uidata.AssocStringBool(ctx.Actives, uidata.PageMultiUnitSelection, false)
	return ctx, nil
}
