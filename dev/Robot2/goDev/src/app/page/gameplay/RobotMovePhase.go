package gameplay

import (
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func RobotMovePhase(origin uidata.UI, robotID string) (uidata.UI, bool, error) {
	fmt.Printf("[RobotMovePhase] robotID(%v)\n", robotID)
	model := def.Model
	model.Push()
	defer model.Pop()
	ctx := origin
	isCanMove := model.QueryMoveCount(robotID) == 0
	if isCanMove == false {
		return origin, false, fmt.Errorf("can not move")
	}
	moveRange := model.QueryMoveRange(robotID)
	for {
		ctx, cursor, cancel, err := SelectPositionStep(ctx, robotID, func(target protocol.Position) error {
			for _, pos := range moveRange {
				if pos == target {
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
		// view.RenderRobotMove(ctx, robotID, ctx.Positions[robotID], cursor)
		err = model.RobotMove(robotID, tool.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, cursor))
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
	return ctx, false, nil
}
