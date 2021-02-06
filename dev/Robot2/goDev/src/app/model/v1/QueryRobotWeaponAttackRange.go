package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
)

func QueryRobotWeaponAttackRange(model model, robot protocol.Robot, weapon protocol.Weapon, offset protocol.Position) ([]protocol.Position, error) {
	var err error
	attackRange, err := helper.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, weapon.Range[0], weapon.Range[1], protocol.Position{})
	if err != nil {
		return nil, err
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
