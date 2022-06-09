package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnCheckWinOrLose(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnCheckWinOrLose", "start")
	ctx := origin
	model := types.Model(ctx.Model.(Model))
	me, has := model.App.Gameplay.Players[protocol.PlayerIDPlayer]
	if has == false {
		return origin, fmt.Errorf("要確認有沒有勝利時找不到(%v)在(%v)", protocol.PlayerIDPlayer, model.App.Gameplay.Players)
	}
	playerWin := true
	{
		for _, currPlayer := range model.App.Gameplay.Players {
			if currPlayer.ID == protocol.PlayerIDPlayer {
				continue
			}
			if currPlayer.GroupID == me.GroupID {
				continue
			}
			robotIDs, err := common.QueryUnitsByPlayer(model, currPlayer.ID)
			if err != nil {
				return ctx, err
			}
			if len(robotIDs) > 0 {
				playerWin = false
				break
			}
		}
	}
	// Win
	if playerWin {
		model.App.Gameplay.State = protocol.GameplayModelStateDone
		model.App.Gameplay.StateReason = protocol.StateReasonWin{}
		ctx.Model = Model(model)
		return ctx, nil
	}
	robotIDs, err := common.QueryUnitsByPlayer(model, me.ID)
	if err != nil {
		return ctx, err
	}
	// Lose
	if len(robotIDs) == 0 {
		model.App.Gameplay.State = protocol.GameplayModelStateDone
		model.App.Gameplay.StateReason = protocol.StateReasonLose{}
		ctx.Model = Model(model)
	}
	log.Log(protocol.LogCategoryPhase, "OnCheckWinOrLose", "end")
	return ctx, nil
}
