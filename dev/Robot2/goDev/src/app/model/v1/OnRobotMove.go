package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/astar"
)

func OnRobotMove(origin uidata.UI, robotID string, tree astar.NodeMap, pos protocol.Position) (interface{}, error) {
	var err error
	ctx := origin
	view := def.View
	ctx.Model, err = RobotMove(ctx.Model.(model), robotID, pos)
	if err != nil {
		return origin, err
	}
	view.RenderRobotMove(ctx, robotID, helper.MoveRangeTree2Path(tree, pos))
	ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, err
	}
	view.Render(ctx)
	return ctx, nil
}
