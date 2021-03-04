package v1

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"strings"
	"time"
)

func OnRobotBattleEnd(origin uidata.UI, robotAfter protocol.Robot, targetRobotAfter protocol.Robot) (uidata.UI, error) {
	var err error
	ctx := origin
	model := types.Model(ctx.Model.(Model))
	view := def.View
	// 賺錢
	{
		msg := []string{}
		if robotAfter.PlayerID == protocol.PlayerIDPlayer {
			if targetRobotAfter.HP <= 0 {
				awardMoney := 0
				{
					robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, targetRobotAfter.ProtoID)
					if err != nil {
						return origin, err
					}
					awardMoney = robotProto.Cost
				}
				model.App.Money += awardMoney
				msg = append(msg, fmt.Sprintf("獲得%v資金", awardMoney))
			}
		}
		if len(msg) > 0 {
			view.Alert(strings.Join(msg, "\n"))
			time.Sleep(3 * time.Second)
		}
		ctx.Model = Model(model)
	}
	// 判斷勝負
	ctx, err = OnCheckWinOrLose(ctx)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}
