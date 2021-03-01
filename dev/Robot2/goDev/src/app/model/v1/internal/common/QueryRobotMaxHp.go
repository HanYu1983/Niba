package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"fmt"
	"strconv"
)

func QueryRobotMaxHp(model types.Model, robotID string, isGameplay bool) (int, error) {
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
	total := robotProto.HP
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "armor1", "armor2", "armor3", "armor4", "armor5",
			"beam_armor1", "beam_armor2", "beam_armor3", "beam_armor4", "beam_armor5",
			"fire_armor", "lighting_armor":
			if len(component.Value) != 2 {
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
