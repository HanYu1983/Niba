package impl

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponRange(model Model, robot protocol.Robot, weapon protocol.Weapon) ([2]int, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return [2]int{}, err
	}
	return weaponProto.Range, nil
}
