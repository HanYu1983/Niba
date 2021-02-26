package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"fmt"
	"strconv"
)

func QueryRobotMovePower(model types.Model, robotID string, isGameplay bool) (int, error) {
	var err error
	robot, err := QueryRobot(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID, isGameplay)
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
	config := data.GameData.Config["default"]
	if config.PowerCostForMove == 0 {
		return 0, fmt.Errorf("config.PowerCostForMove不得為0")
	}
	return total / config.PowerCostForMove, nil
}
