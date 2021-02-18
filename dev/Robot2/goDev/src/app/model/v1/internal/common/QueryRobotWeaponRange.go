package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponRange(model types.Model, robot protocol.Robot, weapon protocol.Weapon) ([2]int, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return [2]int{}, err
	}
	return weaponProto.Range, nil
}
