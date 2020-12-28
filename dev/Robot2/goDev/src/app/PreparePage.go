package app

import "app/tool/uidata"

func PreparePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	var err error
	ctx := origin
	for _, menuID := range ctx.Menus[pageID] {
		ctx, err = PrepareMenu(ctx, menuID)
		if err != nil {
			return origin, err
		}
	}
	return ctx, nil
}
