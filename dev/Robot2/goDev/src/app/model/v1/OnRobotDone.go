package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/uidata"
)

func OnRobotDone(origin uidata.UI, robotID string) (interface{}, error) {
	var err error
	ctx := origin
	view := def.View
	ctx.Model, err = RobotDone(ctx.Model.(model), robotID)
	if err != nil {
		return origin, err
	}
	ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, err
	}
	view.Render(ctx)
	return ctx, nil
}
