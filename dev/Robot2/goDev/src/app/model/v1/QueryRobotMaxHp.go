package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
)

func QueryRobotMaxHp(model model, robotID string) (int, error) {
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
	total := robotProto.Hp
	for _, component := range components {
		val := 0
		switch component.ProtoID {
		case "armor1", "armor2", "armor3", "armor4", "armor5",
			"beam_armor1", "beam_armor2", "beam_armor3", "beam_armor4", "beam_armor5",
			"fire_armor", "lighting_armor":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.Atoi(component.Value[0])
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += val
	}
	return total, nil
}
