package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
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
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return 0, err
	}
	total := robotProto.Power
	for _, component := range components {
		switch component.ProtoID {
		case "engine1", "engine2", "engine3", "engine4", "engine5":
			if len(component.Value) != 1 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err := strconv.ParseFloat(component.Value[0], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
			total += int(val)
		}
		total -= component.PowerCost
	}
	return total / 5, nil
}
