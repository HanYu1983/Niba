package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponAbility(model types.Model, robot protocol.Robot, weapon protocol.Weapon) ([]string, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return []string{}, err
	}
	return weaponProto.Ability, nil
}
