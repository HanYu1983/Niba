package v1

import "app/tool/protocol"

func IsFriendlyRobot(model model, unitID1 string, unitID2 string) (bool, error) {
	unit1, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, unitID1)
	if err != nil {
		return false, err
	}
	unit2, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, unitID2)
	if err != nil {
		return false, err
	}
	plyr1, err := protocol.TryGetStringPlayer(model.App.Gameplay.Players, unit1.PlayerID)
	if err != nil {
		return false, err
	}
	plyr2, err := protocol.TryGetStringPlayer(model.App.Gameplay.Players, unit2.PlayerID)
	if err != nil {
		return false, err
	}
	return plyr1.GroupID == plyr2.GroupID, nil
}
