package v1

import (
	"app/tool"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func CheckInvalidWeapon(model model, robot protocol.Robot, weapon protocol.Weapon, units []string) (string, error) {
	tag, _ := protocol.TryGetStringTag(model.App.Gameplay.Tags, robot.ID)
	if tag.MoveCount > 0 {
		ability, err := QueryRobotWeaponAbility(model, robot, weapon)
		if err != nil {
			return "", err
		}
		hasMoveAttack := len(tool.FilterString(ability, func(c string) bool {
			return c == "moveAttack"
		})) > 0
		if hasMoveAttack == false {
			return "你必須有moveAttack能力, 不然不能移動後攻擊", nil
		}
	}
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
