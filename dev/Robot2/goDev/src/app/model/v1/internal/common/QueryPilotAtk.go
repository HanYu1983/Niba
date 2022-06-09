package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"fmt"
)

func QueryPilotAtk(model types.Model, robotID string, pilotID string, isGameplay bool) (int, error) {
	robot, err := QueryRobot(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	if robot.PilotID != pilotID {
		return 0, fmt.Errorf("[QueryPilotAtk] PilotID(%v) not match robot(%v)", pilotID, robot)
	}
	pilot, err := QueryPilot(model, pilotID, isGameplay)
	if err != nil {
		return 0, err
	}
	pilotProto, err := data.TryGetStringPilotProto(data.GameData.Pilot, pilot.ProtoID)
	if err != nil {
		return 0, err
	}
	return pilotProto.Atk, nil
}
