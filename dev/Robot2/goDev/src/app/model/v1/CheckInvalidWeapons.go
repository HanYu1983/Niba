package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func CheckInvalidWeapon(model model, robot protocol.Robot, weapon protocol.Weapon, units []string) (string, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return "", err
	}
	switch weaponProto.EnergyType {
	case "energy":
		cost := weaponProto.EnergyCost
		if robot.EN < cost {
			return fmt.Sprintf("能量不足(%v/%v)", cost, robot.EN), nil
		}
	case "bullet":
		if weapon.BulletCount == 0 {
			return "彈藥不足", nil
		}
	default:
		return fmt.Sprintf("未定義的能量類型(%+v)", weaponProto), nil
	}
	{
		robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
		if err != nil {
			return "", err
		}
		attackRange, err := QueryRobotWeaponAttackRange(model, robot, weapon, robotPos)
		if err != nil {
			return "", err
		}
		unitPosList := []protocol.Position{}
		for _, unitID := range units {
			unitPosList = append(unitPosList, model.App.Gameplay.Positions[unitID])
		}
		unitPosOutSideOfRange := protocol.DifferencePosition(unitPosList, attackRange)
		isAllUnitOutSideOutRange := len(unitPosOutSideOfRange) == len(unitPosList)
		if isAllUnitOutSideOutRange {
			return fmt.Sprintf("敵人不在範圍內"), nil
		}
	}
	return "", nil
}

func CheckInvalidWeapons(model model, robot protocol.Robot, weapons protocol.Weapons) (map[string]string, error) {
	ret := map[string]string{}
	robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return ret, err
	}
	leftTopPos := protocol.Position{robotPos[0] - 10, robotPos[1] - 10}
	rightBottomPos := protocol.Position{robotPos[0] + 10, robotPos[1] + 10}
	units := SearchUnitByRegion(model.App.Gameplay.Positions, leftTopPos, rightBottomPos)
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
