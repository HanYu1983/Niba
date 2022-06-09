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
TURN:
	for {
		log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "ObservePage")
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		evt := view.AskCommand()
		if evt == nil {
			return origin, false, protocol.ErrTerminate
		}
		ctx, err = helper.UIReduce(common.HandleCursor, common.HandleCamera, common.HandleShowMoveRangeWhenUnitAtCursor)(ctx, evt)
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
		ctxObj, err := ctx.Model.OnEventPlayerTurnPhase(ctx, evt)
		if err != nil {
			return origin, false, err
		}
		ctx = ctxObj.(uidata.UI)
		// 更新移動範圍
		ctx, err = common.HandleShowMoveRangeWhenUnitAtCursor(ctx, struct{}{})
		if err != nil {
			return origin, false, err
		}
		if ctx.Model.State() == protocol.GameplayModelStateDone {
			break
		}
	}
	log.Log(protocol.LogCategoryPhase, "PlayerTurnPhase", "end")
	return ctx, false, nil
}
