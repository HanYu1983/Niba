package v1

import (
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/astar"
)

func OnRobotMove(origin uidata.UI, robotID string, tree astar.NodeMap, pos protocol.Position) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	model := types.Model(ctx.Model.(Model))
	model, err = impl.RobotMove(model, robotID, pos)
	if err != nil {
		return origin, err
	}
	ctx.Model = Model(model)
	view.RenderRobotMove(ctx, robotID, helper.MoveRangeTree2Path(tree, pos))
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}
