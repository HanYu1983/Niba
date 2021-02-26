package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
)

func QueryRobotSuitability(model types.Model, robotID string, isGameplay bool) ([4]float64, error) {
	var err error
	robot, err := QueryRobot(model, robotID, isGameplay)
	if err != nil {
		return [4]float64{}, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return [4]float64{}, err
	}
	return robotProto.Suitability, nil
}
