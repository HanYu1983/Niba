package lobby

import (
	"app/page/common"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func SelectLevelPhase(origin uidata.UI) (uidata.UI, string, bool, error) {
	log.Log(protocol.LogCategoryPhase, "SelectLevelPhase", "start")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSelectLevel, true)
	var levelSelection string
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
			if cancel {
				return ctx, cancel, nil
			}
			levelSelection = selection
			confirm = true
			return ctx, true, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, "", false, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSelectLevel, false)
	cancel := confirm == false
	log.Log(protocol.LogCategoryDetail, "SelectLevelPhase", fmt.Sprintf("levelSelection(%v) cancel(%v)", levelSelection, cancel))
	log.Log(protocol.LogCategoryPhase, "SelectLevelPhase", "end")
	return ctx, levelSelection, cancel, nil
}
