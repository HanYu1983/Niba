package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotSuitability(model model, robotID string) ([4]float64, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return [4]float64{}, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return [4]float64{}, err
	}
	return robotProto.Suitability, nil
}
