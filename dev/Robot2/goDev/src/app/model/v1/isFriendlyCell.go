package v1

import "app/tool/protocol"

func isFriendlyCell(model model, unitID string, pos protocol.Position) (bool, error) {
	unitAtPos := SearchUnitByPosition(model.App.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos == notFound {
		return true, nil
	}
	if robot, is := model.App.Gameplay.Robots[unitAtPos]; is {
		return isFriendlyRobot(model, unitID, robot.ID)
	}
	if item, is := model.App.Gameplay.Items[unitAtPos]; is {
		var _ = item
		return true, nil
	}
	return false, nil
}
