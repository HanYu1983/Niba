package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponAbility(model model, robot protocol.Robot, weapon protocol.Weapon) ([]string, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return []string{}, err
	}
	return weaponProto.Ability, nil
}
