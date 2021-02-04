package gameplay

import (
	"app/page/common"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func SystemMenuPhase(origin uidata.UI) (uidata.UI, string, error) {
	log.Log(protocol.LogCategoryPhase, "SystemMenuPhase", "start")
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
	var err error
	var cancel, tab bool
	var selection string
	for {
		ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageSystemMenu, uidata.Menu1DSystemMenu)
		if err != nil {
			return origin, "", err
		}
		if tab {
			continue
		}
		if cancel {
			return origin, "", nil
		}
		break
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	log.Log(protocol.LogCategoryPhase, "SystemMenuPhase", "end")
	return origin, selection, nil
}
