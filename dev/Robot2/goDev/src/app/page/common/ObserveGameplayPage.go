package common

import (
	"app/tool"
	"app/tool/data"
	"app/tool/uidata"
)

func ObserveGameplayPage(origin uidata.UI, id int) (uidata.UI, error) {
	//var err error
	ctx := origin
	view := ctx.GameplayPages[id]
	modelMap := model.GetMap()
	// camera
	view.Camera[0] = tool.Max(0, tool.Min(len(modelMap[0])-uidata.MapWidth, view.Camera[0]))
	view.Camera[1] = tool.Max(0, tool.Min(len(modelMap)-uidata.MapHeight, view.Camera[1]))
	// cursor
	view.Cursor = data.World2Local(view.Camera, model.GetCursor())
	view.Cursor[0] = tool.Max(0, tool.Min(view.Cursor[0], uidata.MapWidth-1))
	view.Cursor[1] = tool.Max(0, tool.Min(view.Cursor[1], uidata.MapHeight-1))
	// local map
	for x := 0; x < len(view.Map[0]); x++ {
		for y := 0; y < len(view.Map); y++ {
			view.Map[y][x] = modelMap[view.Camera[1]+y][view.Camera[0]+x]
		}
	}
	// local units
	leftTop := view.Camera
	rightBottom := data.Position{leftTop[0] + uidata.MapWidth, leftTop[1] + uidata.MapHeight}
	view.Units = model.QueryUnitsByRegion(leftTop, rightBottom)
	// local position
	localPosDict := map[string]data.Position{}
	for _, id := range view.Units {
		pos := model.GetGameplayPositions()[id]
		localPosDict[id] = data.World2Local(view.Camera, pos)
	}
	view.Positions = localPosDict
	// apply
	ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, id, view)
	return ctx, nil
}
