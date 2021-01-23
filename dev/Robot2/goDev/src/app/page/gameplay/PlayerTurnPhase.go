package gameplay

import (
	"app/page/common"
	"app/tool/uidata"
	"fmt"
)

func PlayerTurnPhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("PlayerTurnPhase start")
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			model.Reset()
			return origin, err
		}
		view.Render(ctx)
		cmd := view.AskCommand()
		ctx, err = HandleCursor(ctx, cmd)
		if err != nil {
			model.Reset()
			return origin, err
		}
		ctx, err = HandleCamera(ctx, cmd)
		if err != nil {
			model.Reset()
			return origin, err
		}
		switch detail := cmd.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			default:
				gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
				cursor := gameplayPage.Cursor
				unitID := common.SearchUnitByPosition(gameplayPage.Positions, cursor)
				var notFound string
				if unitID == notFound {
					ctx, err = SystemMenuPhase(ctx)
				} else {
					ctx, err = UnitMenuPhase(ctx, unitID)
				}
				if err != nil {
					model.Reset()
					return origin, err
				}
			}
		default:
			var _ = detail
		}
		if model.IsDone() {
			break
		}
	}
	fmt.Println("PlayerTurnPhase end")
	return ctx, nil
}
