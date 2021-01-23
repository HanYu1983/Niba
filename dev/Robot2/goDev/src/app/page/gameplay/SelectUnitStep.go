package gameplay

import (
	"app/page/common"
	"app/tool/uidata"
	"fmt"
)

func SelectUnitStep(origin uidata.UI, unitID string, validFn func(unitID string) error) (uidata.UI, string, bool, error) {
	fmt.Println("SelectUnitStep start")
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
		ctx, err = HandleCursor(ctx, evt)
		if err != nil {
			model.Reset()
			return origin, "", false, err
		}
		ctx, err = HandleCamera(ctx, evt)
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
