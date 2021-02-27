package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
)

func QueryPilot(model types.Model, pilotID string, isGameplay bool) (protocol.Pilot, error) {
	if isGameplay {
		robot, has := model.App.Gameplay.Pilots[pilotID]
		if has == false {
			return protocol.Pilot{}, fmt.Errorf("pilotID(%v) not found", pilotID)
		}
		return robot, nil
	}
	robot, has := model.App.Lobby.Pilots[pilotID]
	if has == false {
		return protocol.Pilot{}, fmt.Errorf("pilotID(%v) not found", pilotID)
	}
	return robot, nil
}
