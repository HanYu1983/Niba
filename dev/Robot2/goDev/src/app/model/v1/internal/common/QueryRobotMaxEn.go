package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"fmt"
	"strconv"
)

func QueryRobotMaxEn(model types.Model, robotID string, isGameplay bool) (int, error) {
	var err error
	robot, err := QueryRobot(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	total := robotProto.EN
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "energy1", "energy2", "energy3", "energy4", "energy5":
			if len(component.Value) != 1 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[0], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	return total, nil
}
