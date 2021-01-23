package gameplay

import (
	"app/tool/data"
	"app/tool/uidata"
)

func SelectPositionStep(origin uidata.UI, robotID string, isValid func(data.Position) error) (uidata.UI, data.Position, bool, error) {
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
WaitSpace:
	for {
		evt := view.AskCommand()
		ctx, err = HandleCursor(ctx, evt)
		if err != nil {
			model.Reset()
			return origin, data.Position{}, false, err
		}
		ctx, err = HandleCamera(ctx, evt)
		if err != nil {
			model.Reset()
			return origin, data.Position{}, false, err
		}
		switch detail := evt.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeCancel:
				return origin, data.Position{}, true, nil
			case uidata.KeyCodeEnter:
				if errMsg := isValid(ctx.GameplayPages[uidata.PageGameplay].Cursor); errMsg != nil {
					view.Alert(errMsg.Error())
					continue
				}
				break WaitSpace
			}
		}
	}
	return ctx, ctx.GameplayPages[uidata.PageGameplay].Cursor, false, nil
}
