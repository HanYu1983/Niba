package impl

import (
	"app/tool/protocol"
	"tool/astar"
)

func QueryMoveRangeTree(model Model, robotID string) (astar.NodeMap, error) {
	pos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robotID)
	if err != nil {
		return nil, err
	}
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return nil, err
	}
	costFn, err := RobotMoveCost(model, robot)
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
