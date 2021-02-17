package impl

import (
	"app/tool"
	"app/tool/protocol"
	"fmt"
)

func CheckInvalidWeapons(model Model, robot protocol.Robot, weapons protocol.Weapons) (map[string]string, error) {
	ret := map[string]string{}
	robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return ret, err
	}
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(model.App.Gameplay.Positions, leftTopPos, rightBottomPos)
	// 選出敵對的機體
	units = tool.FilterString(units, func(unitID string) bool {
		isFriendly, err := IsFriendlyRobot(model, robot.ID, unitID)
		if err != nil {
			fmt.Println(err.Error())
			return false
		}
		return isFriendly == false
	})
	var notFound string
	for weaponID, weapon := range weapons {
		validStr, err := CheckInvalidWeapon(model, robot, weapon, units)
		if err != nil {
			return ret, err
		}
		if validStr != notFound {
			ret[weaponID] = validStr
		}
	}
	return ret, nil
}
