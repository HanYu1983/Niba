package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnEventPlayerTurnPhase(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnEventPlayerTurnPhase", "start")
	ctx := origin
	switch detail := evt.(type) {
	case uidata.CommandKeyDown:
		switch detail.KeyCode {
		case uidata.KeyCodeL, uidata.KeyCodeR:
			model := types.Model(ctx.Model.(Model))
			robotIDs, err := common.QueryUnitsByPlayer(model, protocol.PlayerIDPlayer)
			if err != nil {
				return origin, nil
			}
			if len(robotIDs) == 0 {
				return origin, nil
			}
			var nextUnitID string
			unitAtCursor := common.SearchUnitByPosition(model.App.Gameplay.Positions, model.App.Gameplay.Cursor)
			log.Log(protocol.LogCategoryDetail, "OnEventPlayerTurnPhase", fmt.Sprintf("unitAtCursor(%v)", unitAtCursor))
			var notFound string
			if unitAtCursor == notFound {
				switch detail.KeyCode {
				case uidata.KeyCodeL:
					nextUnitID = robotIDs[len(robotIDs)-1]
				case uidata.KeyCodeR:
					nextUnitID = robotIDs[0]
				}
			} else {
				i := tool.FindStringIndex(robotIDs, unitAtCursor)
				if i == -1 {
					return origin, fmt.Errorf("[OnEventPlayerTurnPhase] unitAtCursor(%v) not found in myRobotIDs(%v)", unitAtCursor, robotIDs)
				}
				switch detail.KeyCode {
				case uidata.KeyCodeL:
					i--
				case uidata.KeyCodeR:
					i++
				}
				i = (i + len(robotIDs)) % len(robotIDs)
				nextUnitID = robotIDs[i]
			}
			log.Log(protocol.LogCategoryDetail, "OnEventPlayerTurnPhase", fmt.Sprintf("nextUnitID(%v)", nextUnitID))
			nextCursor := model.App.Gameplay.Positions[nextUnitID]
			log.Log(protocol.LogCategoryDetail, "OnEventPlayerTurnPhase", fmt.Sprintf("nextCursor(%v)", nextCursor))
			model.App.Gameplay.Cursor = nextCursor
			ctx.Model = Model(model)
		}
	}
	log.Log(protocol.LogCategoryPhase, "OnEventPlayerTurnPhase", "end")
	return ctx, nil
}
