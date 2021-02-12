package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func OnRobotSkyGround(origin uidata.UI, robotID string, sky bool) (uidata.UI, error) {
	ctx := origin
	suitabiity, err := QueryRobotSuitablility(ctx.Model.(model), robotID)
	if err != nil {
		return origin, err
	}
	switch {
	case sky == false && suitabiity[data.SuitabilitySky] == 0:
		model := ctx.Model.(model)
		tag := model.App.Gameplay.Tags[robotID]
		tag.Sky = sky
		model.App.Gameplay.Tags = protocol.AssocStringTag(model.App.Gameplay.Tags, robotID, tag)
		ctx.Model = model
	case sky && suitabiity[data.SuitabilityGround] == 0:
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