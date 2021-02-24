package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
	"tool/astar"
)

func QueryMostCloseEnemyPosition(model types.Model, robotID string) (protocol.Position, bool, error) {
	originPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robotID)
	if err != nil {
		return protocol.Position{}, false, err
	}
	costFn, err := RobotMoveCost(model, robotID, 999999, true)
	if err != nil {
		return protocol.Position{}, false, err
	}
	var targetPosition protocol.Position
	_, find := astar.ShortedPathTree(
		originPos,
		func(curr *astar.Node) bool {
			currPos := curr.Pather.(protocol.Position)
			// unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, currPos)
			friendCell, err := IsFriendlyCell(model, robotID, currPos)
			if err != nil {
				fmt.Println(err.Error())
				return true
			}
			targetPosition = currPos
			return friendCell == false
		},
		costFn,
		func(curr *astar.Node) float64 {
			return 0
		},
	)
	return targetPosition, find, nil
}
