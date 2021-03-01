package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func QueryRobotWeaponAttackRange(model types.Model, robotID string, weapon protocol.Weapon, offset protocol.Position) ([]protocol.Position, error) {
	var err error
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return nil, err
	}
	weaponRange, err := QueryRobotWeaponRange(model, robotID, weapon, true)
	if err != nil {
		return nil, err
	}
	attackRange := []protocol.Position{}
	switch weaponProto.Type {
	case "single":
		attackRange, err = helper.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, weaponRange[0], weaponRange[1], protocol.Position{})
		if err != nil {
			return nil, err
		}
	case "line":
		attackRange, err = helper.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, 0, weaponRange[0], protocol.Position{})
		if err != nil {
			return nil, err
		}
	default:
		return nil, fmt.Errorf("unknown weapon type (%v)", weaponProto)
	}
	zeroOffset := protocol.Position{}
	if offset == zeroOffset {
		return attackRange, nil
	}
	attackRangeWithCenter := []protocol.Position{}
	for _, attackPos := range attackRange {
		attackPosWithCenter := protocol.Position{offset[0] + attackPos[0], offset[1] + attackPos[1]}
		attackRangeWithCenter = append(attackRangeWithCenter, attackPosWithCenter)
	}
	return attackRangeWithCenter, nil
}
