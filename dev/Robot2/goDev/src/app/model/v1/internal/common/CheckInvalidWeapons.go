package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/protocol"
	"fmt"
)

func CheckInvalidWeapons(model types.Model, robotID string, weapons protocol.Weapons, hideFlag map[int]bool) (map[string]string, error) {
	ret := map[string]string{}
	robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robotID)
	if err != nil {
		return ret, err
	}
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(model.App.Gameplay.Positions, leftTopPos, rightBottomPos)
	// 選出敵對的機體
	units = tool.FilterString(units, func(unitID string) bool {
		isFriendly, err := IsFriendlyRobot(model, robotID, unitID)
		if err != nil {
			fmt.Println(err.Error())
			return false
		}
		return isFriendly == false
	})
	var notFound string
	for weaponID, weapon := range weapons {
		validStr, err := CheckInvalidWeapon(model, robotID, weapon, units, hideFlag)
		if err != nil {
			return ret, err
		}
		if validStr != notFound {
			ret[weaponID] = validStr
		}
	}
	return ret, nil
}
