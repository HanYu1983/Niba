package alg

import (
	"app2/data"
	"fmt"
)

func RobotMovePhase(origin data.Gameplay, robotID string, inputCh <-chan interface{}) (data.Gameplay, bool, error) {
	gameplay := origin
	tag := gameplay.Tags[robotID]
	if tag.MoveCount >= 1 {
		return origin, false, fmt.Errorf("can not move")
	}
	moveRange, err := GetRobotMoveRange(gameplay, robotID)
	if err != nil {
		return origin, false, err
	}
	gameplay, cursor, cancel, err := SelectPositionStep(gameplay, robotID, moveRange, inputCh)
	if err != nil {
		return origin, false, err
	}
	if cancel {
		return origin, true, nil
	}
	RenderRobotMove(gameplay, robotID, gameplay.Positions[robotID], cursor)
	tag.MoveCount++
	gameplay.Tags = data.AssocStringTag(gameplay.Tags, robotID, tag)
	gameplay.Positions = data.AssocStringPosition(gameplay.Positions, robotID, cursor)
	gameplay, err = UnitMenuPhase(gameplay, robotID, inputCh)
	if err != nil {
		return origin, false, err
	}
	return gameplay, false, nil
}
