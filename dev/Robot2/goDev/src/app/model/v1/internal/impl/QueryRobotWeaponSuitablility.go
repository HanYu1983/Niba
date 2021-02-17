package impl

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponSuitability(model Model, robot protocol.Robot, weapon protocol.Weapon) ([4]float64, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return [4]float64{}, err
	}
	return weaponProto.Suitability, nil
}
