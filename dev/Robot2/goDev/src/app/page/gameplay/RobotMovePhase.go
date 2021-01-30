package gameplay

import (
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func RobotMovePhase(origin uidata.UI, robotID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "RobotMovePhase", fmt.Sprintf("robotID(%v)\n", robotID))
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	ctx := origin
	isCanMove := model.QueryMoveCount(robotID) == 0
	if isCanMove == false {
		return origin, false, fmt.Errorf("can not move")
	}
	tree, err := model.QueryMoveRangeTree(robotID)
	if err != nil {
		return origin, false, err
	}
	moveRange := tool.MoveRangeTree2MoveRange(tree)
	model.SetMoveRange(moveRange)
	for {
		ctx, cursor, cancel, err := SelectPositionStep(ctx, robotID, func(ctx uidata.UI, localCursor protocol.Position) error {
			worldCursor := tool.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, localCursor)
			for _, pos := range moveRange {
				if pos == worldCursor {
					return nil
				}
			}
			return fmt.Errorf("you must select in move range")
		})
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		if cancel {
			model.Reset()
			return origin, cancel, nil
		}
		cursorWorld := tool.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, cursor)
		path := tool.MoveRangeTree2Path(tree, cursorWorld)
		view.RenderRobotMove(ctx, robotID, path)
		err = model.RobotMove(robotID, cursorWorld)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		ctx, cancel, err = UnitMenuPhase(ctx, robotID)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		if cancel {
			model.Reset()
			continue
		}
		break
	}
	model.SetMoveRange(nil)
	return ctx, false, nil
}
