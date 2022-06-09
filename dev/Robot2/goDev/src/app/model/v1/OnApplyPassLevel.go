package v1

import (
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"time"
)

func OnApplyPassLevel(origin uidata.UI) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	model := types.Model(ctx.Model.(Model))
	model, err = impl.ApplyPassLevel(model)
	if err != nil {
		return origin, err
	}
	ctx.Model = Model(model)
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
	return ctx, nil
}
