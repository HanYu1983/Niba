package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func CheckInvalidWeapon(app app, robot protocol.Robot, weapon protocol.Weapon) (string, error) {
	robotPos, err := protocol.TryGetStringPosition(app.Gameplay.Positions, robot.ID)
	if err != nil {
		return "", err
	}
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(app.Gameplay.Positions, leftTopPos, rightBottomPos)
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("units(%v)", units))
	attackRange, err := helper.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, weapon.Range[0], weapon.Range[1], robotPos)
	if err != nil {
		return "", err
	}
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("attackRange(%v)", attackRange))
	unitPosList := []protocol.Position{}
	for _, unitID := range units {
		unitPosList = append(unitPosList, app.Gameplay.Positions[unitID])
	}
	unitPosOutSideOfRange := protocol.DifferencePosition(unitPosList, attackRange)
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("unitPosOutSideOfRange(%v)", unitPosOutSideOfRange))
	isAllUnitOutSideOutRange := len(unitPosOutSideOfRange) == len(unitPosList)
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("isAllUnitOutSideOutRange(%v)", isAllUnitOutSideOutRange))
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
