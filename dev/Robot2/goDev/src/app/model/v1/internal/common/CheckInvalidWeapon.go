package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

const (
	HideFlagMoveAttack = iota
	HideFlagEnergyBullet
	HideFlagAttackRange
)

func CheckInvalidWeapon(model types.Model, robotID string, weapon protocol.Weapon, units []string, hideFlag map[int]bool) (string, error) {
	if hideFlag == nil {
		hideFlag = map[int]bool{}
	}
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return "", err
	}
	if _, has := hideFlag[HideFlagMoveAttack]; has == false {
		tag, _ := protocol.TryGetStringTag(model.App.Gameplay.Tags, robotID)
		if tag.MoveCount > 0 {
			ability, err := QueryRobotWeaponAbility(model, robot.ID, weapon, true)
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
	}

	if _, has := hideFlag[HideFlagEnergyBullet]; has == false {
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
	}
	if _, has := hideFlag[HideFlagAttackRange]; has == false {
		robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
		if err != nil {
			return "", err
		}
		attackRange, err := QueryRobotWeaponAttackRange(model, robot.ID, weapon, robotPos)
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
