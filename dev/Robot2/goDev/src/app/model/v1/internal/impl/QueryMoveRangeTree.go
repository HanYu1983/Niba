package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"tool/astar"
)

func QueryMoveRangeTree(model types.Model, robotID string) (astar.NodeMap, error) {
	pos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robotID)
	if err != nil {
		return nil, err
	}
	movePower, err := common.QueryRobotMovePower(model, robotID, true)
	if err != nil {
		return nil, err
	}
	costFn, err := common.RobotMoveCost(model, robotID, movePower, false)
	if err != nil {
		return nil, err
	}
	tree, _ := astar.ShortedPathTree(
		pos,
		func(curr *astar.Node) bool {
			return false
		},
		costFn,
		func(curr *astar.Node) float64 {
			return 1
		},
	)
	return tree, nil
}
