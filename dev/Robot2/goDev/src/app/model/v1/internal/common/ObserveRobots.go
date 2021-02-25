package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func ObserveRobots(model types.Model, origin map[string]protocol.Robot) (map[string]protocol.Robot, error) {
	localRobots := map[string]protocol.Robot{}
	for ID, robot := range origin {
		robot, err := ObserveRobot(model, robot)
		if err != nil {
			return origin, err
		}
		localRobots[ID] = robot
	}
	return localRobots, nil
}