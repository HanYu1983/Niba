package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func IsFriendlyCell(model types.Model, unitID string, pos protocol.Position) (bool, error) {
	unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos == notFound {
		return true, nil
	}
	if robot, is := model.App.Gameplay.Robots[unitAtPos]; is {
		return IsFriendlyRobot(model, unitID, robot.ID)
	}
	if item, is := model.App.Gameplay.Items[unitAtPos]; is {
		var _ = item
		return true, nil
	}
	return false, nil
}
