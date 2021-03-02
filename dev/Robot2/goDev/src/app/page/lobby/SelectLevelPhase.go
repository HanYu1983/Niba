package lobby

import (
	"app/page/common"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func SelectLevelPhase(origin uidata.UI) (uidata.UI, protocol.SelectLevelSelection, bool, error) {
	log.Log(protocol.LogCategoryPhase, "SelectLevelPhase", "start")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSelectLevel, true)
	var levelSelection protocol.SelectLevelSelection
	var confirm bool
	ctx, err = common.BasicPagePhase(
		ctx,
		uidata.PageSelectLevel,
		true,
		func(origin uidata.UI) (uidata.UI, error) {
			return origin, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			log.Log(protocol.LogCategoryDetail, "SelectLevelPhase", fmt.Sprintf("cancel(%v) tab(%v)", cancel, tab))
			ctx := origin
			menuID := ctx.Menus[uidata.PageSelectLevel][focus]
			if cancel {
				return ctx, cancel, nil
			}
			menu, has := ctx.Menu1Ds[menuID]
			if has == false {
				return ctx, cancel, fmt.Errorf("選擇關卡時找不到menu(%v). 請檢查DefaultUI或是ObserveMenu1D中有沒有給予Options.", menuID)
			}
			levelSelection.MenuID = menuID
			levelSelection.Cursor = menu.Cursor
			confirm = true
			return ctx, true, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, protocol.SelectLevelSelection{}, false, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSelectLevel, false)
	cancel := confirm == false
	log.Log(protocol.LogCategoryDetail, "SelectLevelPhase", fmt.Sprintf("levelSelection(%v) cancel(%v)", levelSelection, cancel))
	log.Log(protocol.LogCategoryPhase, "SelectLevelPhase", "end")
	return ctx, levelSelection, cancel, nil
}
