package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponRange(model types.Model, robotID string, weapon protocol.Weapon, isGameplay bool) ([2]int, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return [2]int{}, err
	}
	return weaponProto.Range, nil
}
