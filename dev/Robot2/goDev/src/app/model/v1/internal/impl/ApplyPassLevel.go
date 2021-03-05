package impl

import (
	"app/model/v1/internal/tool/types"
	"fmt"
)

func ApplyPassLevel(origin types.Model) (types.Model, error) {
	ctx := origin
	if ctx.App.Gameplay.StateReason == nil {
		return origin, fmt.Errorf("State == GameplayModelStateDone. 但是StateReason是空值，請確認當設定為GameplayModelStateDone時, 一定要給StateReason")
	}
	levelID := ctx.App.Gameplay.LevelID
	_, has := types.DefaultNormalLevels[levelID]
	if has == false {
		return origin, fmt.Errorf("要應用過關時, 但LevelID(%v)找不到", levelID)
	}
	// TODO
	ctx.App.Lobby.ClearStateByLevelID[levelID] = true
	return ctx, nil
}
