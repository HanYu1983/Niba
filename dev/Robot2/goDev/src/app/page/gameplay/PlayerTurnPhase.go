package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func PlayerTurnPhase(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "start")
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	for {
		log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "ObservePage")
		ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			model.Reset()
			return origin, err
		}
		view.Render(ctx)
		evt := view.AskCommand()
		if evt == nil {
			model.Reset()
			return origin, protocol.ErrTerminate
		}
		ctx, err = helper.UIReduce(HandleCursor, HandleCamera, HandleShowMoveRangeWhenUnitAtCursor)(ctx, evt)
		if err != nil {
			model.Reset()
			return origin, err
		}
		switch detail := evt.(type) {
		case uidata.CommandKeyDown:
			switch detail.KeyCode {
			case uidata.KeyCodeEnter:
				gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
				// search unit at cursor
				var unitID string
				for currUnitID, pos := range gameplayPage.Positions {
					if pos == gameplayPage.Cursor {
						unitID = currUnitID
						break
					}
				}
				var notFound string
				if unitID == notFound {
					ctx, err = SystemMenuPhase(ctx)
					if err != nil {
						model.Reset()
						return origin, err
					}
				} else {
					ctx, _, err = UnitMenuPhase(ctx, unitID)
					if err != nil {
						model.Reset()
						return origin, err
					}
				}
			}
		default:
			var _ = detail
		}
		if model.IsDone() {
			break
		}
	}
	log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "end")
	return ctx, nil
}
