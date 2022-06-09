package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func ObservePilot(model types.Model, pilot protocol.Pilot, isGameplay bool) (protocol.Pilot, error) {
	var err error
	pilotProto, err := data.TryGetStringPilotProto(data.GameData.Pilot, pilot.ProtoID)
	if err != nil {
		return protocol.Pilot{}, err
	}
	pilot.Title = pilotProto.Title
	pilot.Melee = pilotProto.Melee
	pilot.Range = pilotProto.Melee
	pilot.Atk = pilotProto.Atk
	pilot.Guard = pilotProto.Guard
	pilot.Evade = pilotProto.Evade
	pilot.Tech = pilotProto.Tech
	return pilot, nil
}
