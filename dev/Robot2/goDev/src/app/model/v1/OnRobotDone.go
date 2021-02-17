package v1

import (
	"app/model/v1/internal/impl"
	"app/tool/def"
	"app/tool/uidata"
)

func OnRobotDone(origin uidata.UI, robotID string) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	model, err := impl.RobotDone(impl.Model(ctx.Model.(Model)), robotID)
	if err != nil {
		return origin, err
	}
	ctx.Model = Model(model)
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
