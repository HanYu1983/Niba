package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func CheckInvalidWeapon(app app, robot protocol.Robot, weapon protocol.Weapon) (string, error) {
	robotPos := app.Gameplay.Positions[robot.ID]
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(app.Gameplay.Positions, leftTopPos, rightBottomPos)
	attackRange, err := helper.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, weapon.Range[0], weapon.Range[1], robotPos)
	if err != nil {
		return "", err
	}
	unitPosList := []protocol.Position{}
	for _, unitID := range units {
		unitPosList = append(unitPosList, app.Gameplay.Positions[unitID])
	}
	unitPosOutSideOfRange := protocol.DifferencePosition(unitPosList, attackRange)
	isAllUnitOutSideOutRange := len(unitPosOutSideOfRange) == len(unitPosList)
	if isAllUnitOutSideOutRange {
		return fmt.Sprintf("敵人不在範圍內"), nil
	}
	return "", nil
}

func CheckInvalidWeapons(app app, robot protocol.Robot, weapons protocol.Weapons) (map[string]string, error) {
	ret := map[string]string{}
	var notFound string
	for weaponID, weapon := range weapons {
		validStr, err := CheckInvalidWeapon(app, robot, weapon)
		if err != nil {
			return ret, err
		}
		if validStr != notFound {
			ret[weaponID] = validStr
		}
	}
	return ret, nil
}
