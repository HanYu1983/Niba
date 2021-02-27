package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func QueryUnitsByPlayer(model types.Model, playerID string) ([]string, error) {
	_, err := protocol.TryGetStringPlayer(model.App.Gameplay.Players, playerID)
	if err != nil {
		return []string{}, err
	}
	ret := []string{}
	for ID, robot := range model.App.Gameplay.Robots {
		if robot.PlayerID == playerID {
			ret = append(ret, ID)
		}
	}
	return ret, nil
}

func IsRobotDone(model types.Model, robotID string) (bool, error) {
	return model.App.Gameplay.Tags[robotID].IsDone, nil
}
