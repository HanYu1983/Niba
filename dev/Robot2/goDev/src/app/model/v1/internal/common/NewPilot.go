package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func NewPilot(origin types.Model, pilot protocol.Pilot) (types.Model, protocol.Pilot, error) {
	var err error
	ctx := origin
	var notFound string
	_, err = data.TryGetStringPilotProto(data.GameData.Pilot, pilot.ProtoID)
	if err != nil {
		return origin, protocol.Pilot{}, err
	}
	if pilot.ID == notFound {
		pilot.ID = fmt.Sprintf("NewPilot_%v", ctx.App.SeqID)
		ctx.App.SeqID++
	}
	// 算完後再重設
	ctx.App.Gameplay.Pilots = protocol.AssocStringPilot(ctx.App.Gameplay.Pilots, pilot.ID, pilot)
	return ctx, pilot, nil
}
