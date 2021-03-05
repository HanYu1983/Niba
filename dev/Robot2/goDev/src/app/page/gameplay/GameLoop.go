package gameplay

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"time"
	"tool/log"
)

func GameLoop(origin uidata.UI) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "GameLoop", "start")
	var err error
	ctx := origin
	view := def.View
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, true)
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, err
	}
	for {
		var activePlayer protocol.Player
		activePlayer, err = ctx.Model.QueryActivePlayer()
		if err != nil {
			return origin, err
		}
		var cancel bool
		ctx, cancel, err = TurnPhase(ctx, activePlayer)
		if err != nil {
			return origin, err
		}
		if cancel {
			break
		}
		if ctx.Model.State() == protocol.GameplayModelStateDone {
			break
		}
		ctx.Model, err = ctx.Model.NextPlayer()
		if err != nil {
			return origin, err
		}
	}
	if ctx.Model.StateReason() == nil {
		return origin, fmt.Errorf("State == GameplayModelStateDone. 但是StateReason是空值，請確認當設定為GameplayModelStateDone時, 一定要給StateReason")
	}
	switch detail := ctx.Model.StateReason().(type) {
	case protocol.StateReasonGiveUp:
		view.Alert("你放棄了遊戲, 將回到機庫")
		time.Sleep(2 * time.Second)
	case protocol.StateReasonLose:
		view.Alert("你輸了遊戲, 將回到機庫")
		time.Sleep(2 * time.Second)
	case protocol.StateReasonWin:
		view.Alert("你勝了遊戲, 將回到機庫")
		time.Sleep(2 * time.Second)
	default:
		return origin, fmt.Errorf("離開了GameLoop，卻不知原因(%+v)。請檢查", detail)
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageGameplay, false)
	log.Log(protocol.LogCategoryPhase, "GameLoop", "end")
	return ctx, nil
}
