package common

import (
	"app/tool/helper"
	"app/tool/uidata"
)

func HandleShowMoveRangeWhenUnitAtCursor(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	ctx := origin
	var notFound string
	unitAtCursor := ctx.Model.QueryUnitByPosition(ctx.Model.GetCursor())
	if unitAtCursor != notFound {
		tree, err := ctx.Model.QueryMoveRangeTree(unitAtCursor)
		if err != nil {
			return origin, err
		}
		moveRange := helper.MoveRangeTree2MoveRange(tree)
		ctx.Model = ctx.Model.SetMoveRange(moveRange)
	} else {
		ctx.Model = ctx.Model.SetMoveRange(nil)
	}
	return ctx, nil
}
