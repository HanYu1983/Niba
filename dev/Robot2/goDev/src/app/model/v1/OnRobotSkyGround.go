package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func OnRobotSkyGround(origin uidata.UI, robotID string, sky bool) (uidata.UI, error) {
	ctx := origin
	suitabiity, err := QueryRobotSuitability(ctx.Model.(model), robotID)
	if err != nil {
		return origin, err
	}
	switch {
	case sky == false:
		if suitabiity[data.SuitabilityGround] == 0 {
			return origin, fmt.Errorf("你無法到地上. suitabiity(%v)", suitabiity)
		}
		model := ctx.Model.(model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.Sky = sky
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	case sky:
		if suitabiity[data.SuitabilitySky] == 0 {
			return origin, fmt.Errorf("你無法到空中. suitabiity(%v)", suitabiity)
		}
		model := ctx.Model.(model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.Sky = sky
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	default:
		return origin, fmt.Errorf("[OnRobotSkyGround]unknown situation. sky(%v) tag(%+v)", sky, ctx.Model.(model).App.Gameplay.Tags[robotID])
	}
	return ctx, nil
}
