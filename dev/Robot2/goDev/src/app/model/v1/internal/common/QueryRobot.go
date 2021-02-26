package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
)

func QueryRobot(model types.Model, robotID string, isGameplay bool) (protocol.Robot, error) {
	if isGameplay {
		robot, has := model.App.Gameplay.Robots[robotID]
		if has == false {
			return protocol.Robot{}, fmt.Errorf("robotID(%v) not found", robotID)
		}
		return robot, nil
	}
	robot, has := model.App.Lobby.Robots[robotID]
	if has == false {
		return protocol.Robot{}, fmt.Errorf("robotID(%v) not found", robotID)
	}
	robot.PilotID = model.App.Lobby.PilotIDByRobotID[robot.ID]
	return robot, nil
}

func QueryPilot(model types.Model, pilotID string, isGameplay bool) (protocol.Pilot, error) {
	if isGameplay {
		robot, has := model.App.Gameplay.Pilots[pilotID]
		if has == false {
			return protocol.Pilot{}, fmt.Errorf("pilotID(%v) not found", pilotID)
		}
		return robot, nil
	}
	robot, has := model.App.Lobby.Pilots[pilotID]
	if has == false {
		return protocol.Pilot{}, fmt.Errorf("pilotID(%v) not found", pilotID)
	}
	return robot, nil
}
