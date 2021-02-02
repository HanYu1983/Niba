package gameplay

import (
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func RobotMovePhase(origin uidata.UI, robotID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "RobotMovePhase", fmt.Sprintf("robotID(%v)\n", robotID))
	view := def.View
	ctx := origin
	isCanMove := ctx.Model.QueryMoveCount(robotID) == 0
	if isCanMove == false {
		return origin, false, fmt.Errorf("can not move")
	}
	tree, err := ctx.Model.QueryMoveRangeTree(robotID)
	if err != nil {
		return origin, false, err
	}
	moveRange := helper.MoveRangeTree2MoveRange(tree)
	ctx.Model = ctx.Model.SetMoveRange(moveRange)
	for {
		ctx, cursor, cancel, err := SelectPositionStep(ctx, robotID, func(ctx uidata.UI, localCursor protocol.Position) error {
			worldCursor := helper.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, localCursor)
			for _, pos := range moveRange {
				if pos == worldCursor {
					return nil
				}
			}
			return fmt.Errorf("you must select in move range")
		})
		if err != nil {

			return origin, false, err
		}
		if cancel {

			return origin, cancel, nil
		}
		cursorWorld := helper.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, cursor)
		path := helper.MoveRangeTree2Path(tree, cursorWorld)
		view.RenderRobotMove(ctx, robotID, path)
		ctx.Model, err = ctx.Model.RobotMove(robotID, cursorWorld)
		if err != nil {
			view.Alert(err.Error())
			continue
		}
		ctx, cancel, err = UnitMenuPhase(ctx, robotID)
		if err != nil {

			return origin, false, err
		}
		if cancel {

			continue
		}
		break
	}
	ctx.Model = ctx.Model.SetMoveRange(nil)
	return ctx, false, nil
}
