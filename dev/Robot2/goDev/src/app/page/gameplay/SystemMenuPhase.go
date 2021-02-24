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
	{
		menu := ctx.Menu1Ds[uidata.Menu1DSystemMenu]
		menu.Cursor = 0
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DSystemMenu, menu)
	}
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
	ctxObj, err := ctx.Model.OnClickSystemMenu(ctx, selection)
	if err != nil {
		return origin, "", err
	}
	ctx = ctxObj.(uidata.UI)
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	log.Log(protocol.LogCategoryPhase, "SystemMenuPhase", "end")
	return ctx, selection, nil
}
