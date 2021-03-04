package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponSuitability(model types.Model, robotID string, weapon protocol.Weapon, isGameplay bool) ([4]float64, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return [4]float64{}, err
	}
	return weaponProto.Suitability, nil
}
