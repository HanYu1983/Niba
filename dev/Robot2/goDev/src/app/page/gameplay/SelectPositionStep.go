package gameplay

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func SelectPositionStep(origin uidata.UI, robotID string, isValid func(uidata.UI, protocol.Position) error) (uidata.UI, protocol.Position, bool, error) {
	log.Log(protocol.LogCategoryPhase, "SelectPositionStep", "start")
	view := def.View
	var err error
	ctx := origin
WaitSpace:
	for {
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, protocol.Position{}, false, err
		}
		evt := view.AskCommand()
		if evt == nil {
			return origin, protocol.Position{}, false, protocol.ErrTerminate
		}
		ctx, err = helper.UIReduce(HandleCursor, HandleCamera)(ctx, evt)
		if err != nil {
			return origin, protocol.Position{}, false, err
		}
		switch detail := evt.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeCancel:
				return origin, protocol.Position{}, true, nil
			case uidata.KeyCodeEnter:
				if errMsg := isValid(ctx, ctx.GameplayPages[uidata.PageGameplay].Cursor); errMsg != nil {
					view.Alert(errMsg.Error())
					continue
				}
				break WaitSpace
			}
		}
	}
	return ctx, ctx.GameplayPages[uidata.PageGameplay].Cursor, false, nil
}
