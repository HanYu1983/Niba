package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
	"strconv"
	"tool/log"
)

func QueryRobotArmor(model types.Model, robotID string, isGameplay bool) (int, error) {
	log.Log(protocol.LogCategoryRender, "QueryRobotArmor", "start")
	var err error
	robot, err := QueryRobot(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID, isGameplay)
	if err != nil {
		return 0, err
	}
	total := 0
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "armor1", "armor2", "armor3", "armor4", "armor5":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[1], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	log.Log(protocol.LogCategoryRender, "QueryRobotArmor", "end")
	return total, nil
}
