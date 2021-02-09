package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeaponAccuracy(model model, robot protocol.Robot, weapon protocol.Weapon) (float64, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return 0.0, err
	}
	return weaponProto.Accuracy, nil
}
