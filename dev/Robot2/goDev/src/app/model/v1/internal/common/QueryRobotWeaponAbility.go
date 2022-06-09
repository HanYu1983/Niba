package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponAbility(model types.Model, robotID string, weapon protocol.Weapon, isGameplay bool) ([]string, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return []string{}, err
	}
	return weaponProto.Ability, nil
}
