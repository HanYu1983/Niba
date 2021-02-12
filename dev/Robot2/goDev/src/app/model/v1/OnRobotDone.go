package v1

import (
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
	ctx, err = ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, err
	}
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}
