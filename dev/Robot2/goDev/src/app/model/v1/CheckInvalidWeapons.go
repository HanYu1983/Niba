package v1

import (
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func CheckInvalidWeapon(model model, robot protocol.Robot, weapon protocol.Weapon) (string, error) {
	robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return "", err
	}
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(model.App.Gameplay.Positions, leftTopPos, rightBottomPos)
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("units(%v)", units))
	attackRange, err := QueryRobotWeaponAttackRange(model, robot, weapon, robotPos)
	if err != nil {
		return "", err
	}
	log.Log("CheckInvalidWeapon", "CheckInvalidWeapon", fmt.Sprintf("attackRange(%v)", attackRange))
	unitPosList := []protocol.Position{}
	for _, unitID := range units {
		unitPosList = append(unitPosList, model.App.Gameplay.Positions[unitID])
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

func CheckInvalidWeapons(model model, robot protocol.Robot, weapons protocol.Weapons) (map[string]string, error) {
	ret := map[string]string{}
	var notFound string
	for weaponID, weapon := range weapons {
		validStr, err := CheckInvalidWeapon(model, robot, weapon)
		if err != nil {
			return ret, err
		}
		if validStr != notFound {
			ret[weaponID] = validStr
		}
	}
	return ret, nil
}
