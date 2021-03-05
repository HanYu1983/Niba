package impl

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
)

func ApplyPassLevel(origin types.Model) (types.Model, error) {
	ctx := origin
	switch detail := ctx.App.Gameplay.StateReason.(type) {
	case protocol.StateReasonGiveUp:
	case protocol.StateReasonLose:
	case protocol.StateReasonWin:
		levelID := ctx.App.Gameplay.LevelID
		_, has := types.DefaultNormalLevels[levelID]
		if has == false {
			return origin, fmt.Errorf("要應用過關時, 但LevelID(%v)找不到", levelID)
		}
		// TODO: 改為使用Assoc
		ctx.App.Lobby.ClearStateByLevelID[levelID] = true
	default:
		return origin, fmt.Errorf("離開了GameLoop，卻不知原因(%+v)。請檢查", detail)
	}
	return ctx, nil
}
