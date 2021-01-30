package gameplay

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/uidata"
)

func HandleShowMoveRangeWhenUnitAtCursor(origin uidata.UI, evt interface{}) (uidata.UI, error) {
	ctx := origin
	model := def.Model
	var notFound string
	unitAtCursor := model.QueryUnitByPosition(model.GetCursor())
	if unitAtCursor != notFound {
		tree, err := model.QueryMoveRangeTree(unitAtCursor)
		if err != nil {
			return origin, err
		}
		moveRange := helper.MoveRangeTree2MoveRange(tree)
		model.SetMoveRange(moveRange)
	} else {
		model.SetMoveRange(nil)
	}
	return ctx, nil
}
