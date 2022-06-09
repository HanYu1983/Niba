package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func ObservePilots(model types.Model, origin map[string]protocol.Pilot, isGameplay bool) (map[string]protocol.Pilot, error) {
	localRobots := map[string]protocol.Pilot{}
	for ID, robot := range origin {
		robot, err := ObservePilot(model, robot, isGameplay)
		if err != nil {
			return origin, err
		}
		localRobots[ID] = robot
	}
	return localRobots, nil
}
