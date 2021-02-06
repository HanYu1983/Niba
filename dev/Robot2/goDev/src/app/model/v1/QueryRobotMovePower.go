package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotMovePower(model model, robotID string) (int, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return 0, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return 0, err
	}
	totalPower := robotProto.Power
	for _, componentProtoID := range robotProto.Components {
		componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, componentProtoID)
		if err != nil {
			return 0, err
		}
		totalPower -= componentProto.PowerCost
	}
	return totalPower / 5, nil
}
