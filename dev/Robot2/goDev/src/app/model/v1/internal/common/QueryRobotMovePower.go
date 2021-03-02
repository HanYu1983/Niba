package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"fmt"
)

func QueryRobotMovePower(model types.Model, robotID string, isGameplay bool) (int, error) {
	var err error
	total, err := QueryRobotPower(model, robotID, isGameplay)
	if err != nil {
		return 0, err
	}
	config := data.GameData.Config["default"]
	if config.PowerCostForMove == 0 {
		return 0, fmt.Errorf("config.PowerCostForMove不得為0")
	}
	return total / config.PowerCostForMove, nil
}
