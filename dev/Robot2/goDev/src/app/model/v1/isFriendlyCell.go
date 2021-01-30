package v1

import "app/tool/protocol"

func isFriendlyCell(app app, unitID string, pos protocol.Position) (bool, error) {
	unitAtPos := SearchUnitByPosition(app.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos == notFound {
		return true, nil
	}
	if robot, is := app.Gameplay.Robots[unitAtPos]; is {
		return isFriendlyRobot(app, unitID, robot.ID)
	}
	if item, is := app.Gameplay.Items[unitAtPos]; is {
		var _ = item
		return true, nil
	}
	return false, nil
}
