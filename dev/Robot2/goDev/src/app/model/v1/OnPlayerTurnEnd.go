package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnPlayerTurnEnd(origin uidata.UI, player protocol.Player) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnPlayerTurnEnd", "start")
	var err error
	ctx := origin
	robots, err := QueryUnitsByPlayer(ctx.Model.(model), player)
	if err != nil {
		return origin, err
	}
	log.Log(protocol.LogCategoryDetail, "OnPlayerTurnEnd", fmt.Sprintf("robots(%v)", robots))
	for _, robotID := range robots {
		model := ctx.Model.(model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.MoveCount = 0
		tag.IsDone = false
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	}
	log.Log(protocol.LogCategoryPhase, "OnPlayerTurnEnd", "end")
	return ctx, nil
}
