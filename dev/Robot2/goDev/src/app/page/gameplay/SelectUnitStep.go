package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func SelectUnitStep(origin uidata.UI, unitID string, validFn func(unitID string) error) (uidata.UI, string, bool, error) {
	log.Log(protocol.LogCategoryPhase, "SelectUnitStep", "start")
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			model.Reset()
			return origin, "", false, err
		}
		view.Render(ctx)
		evt := view.AskCommand()
		if evt == nil {
			return origin, "", false, protocol.ErrTerminate
		}
		ctx, err = helper.UIReduce(HandleCursor, HandleCamera)(ctx, evt)
		if err != nil {
			model.Reset()
			return origin, "", false, err
		}
		switch detail := evt.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeCancel:
				return origin, "", true, nil
			case uidata.KeyCodeEnter:
				gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
				for unitID, pos := range gameplayPage.Positions {
					if pos == gameplayPage.Cursor {
						err := validFn(unitID)
						if err == nil {
							return ctx, unitID, false, nil
						}
						view.Alert(err.Error())
					}
				}
			}
		}
	}
}
