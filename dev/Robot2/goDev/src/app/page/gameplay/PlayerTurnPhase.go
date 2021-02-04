package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
)

func PlayerTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "start")
	view := def.View
	var err error
	var cancel bool
	ctx := origin
	model := ctx.Model
TURN:
	for {
		log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "ObservePage")
		ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			return origin, false, err
		}
		view.Render(ctx)
		evt := view.AskCommand()
		if evt == nil {
			return origin, false, protocol.ErrTerminate
		}
		ctx, err = helper.UIReduce(HandleCursor, HandleCamera, HandleShowMoveRangeWhenUnitAtCursor)(ctx, evt)
		if err != nil {
			return origin, false, err
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
					var selection string
					ctx, selection, err = SystemMenuPhase(ctx)
					if err != nil {
						return origin, false, err
					}
					switch selection {
					case uidata.MenuOptionTurnDone:
						break TURN
					}
				} else {
					ctx, cancel, err = UnitMenuPhase(ctx, unitID)
					if err != nil {
						return origin, false, err
					}
					if cancel {
						continue
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
	return ctx, false, nil
}
