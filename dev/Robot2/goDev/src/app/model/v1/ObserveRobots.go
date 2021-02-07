package v1

import "app/tool/protocol"

func ObserveRobots(model model, origin map[string]protocol.Robot) (map[string]protocol.Robot, error) {
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
