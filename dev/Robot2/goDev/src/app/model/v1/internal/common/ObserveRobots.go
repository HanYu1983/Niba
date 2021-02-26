package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func ObserveRobots(model types.Model, origin map[string]protocol.Robot, isGameplay bool) (map[string]protocol.Robot, error) {
	localRobots := map[string]protocol.Robot{}
	for ID, robot := range origin {
		robot, err := ObserveRobot(model, robot, isGameplay)
		if err != nil {
			return origin, err
		}
		localRobots[ID] = robot
	}
	return localRobots, nil
}
