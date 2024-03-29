package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func OnRobotSkyGround(origin uidata.UI, robotID string, sky bool) (uidata.UI, error) {
	ctx := origin
	suitabiity, err := common.QueryRobotSuitability(types.Model(ctx.Model.(Model)), robotID, true)
	if err != nil {
		return origin, err
	}
	switch {
	case sky == false:
		if suitabiity[data.SuitabilityGround] == 0 {
			return origin, fmt.Errorf("你無法到地上. suitabiity(%v)", suitabiity)
		}
		model := ctx.Model.(Model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.Sky = sky
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	case sky:
		if suitabiity[data.SuitabilitySky] == 0 {
			return origin, fmt.Errorf("你無法到空中. suitabiity(%v)", suitabiity)
		}
		model := ctx.Model.(Model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.Sky = sky
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	default:
		return origin, fmt.Errorf("[OnRobotSkyGround]unknown situation. sky(%v) tag(%+v)", sky, ctx.Model.(Model).App.Gameplay.Tags[robotID])
	}
	return ctx, nil
}
