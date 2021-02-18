package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponAccuracy(model types.Model, robot protocol.Robot, weapon protocol.Weapon) (float64, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return 0.0, err
	}
	return weaponProto.Accuracy, nil
}
