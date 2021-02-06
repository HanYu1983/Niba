package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func QueryRobotWeapons(model model, robot protocol.Robot) (string, protocol.Weapons, error) {
	if weapons, has := robot.WeaponsByTransform[robot.Transform]; has {
		return "", weapons, nil
	}
	weapons := protocol.Weapons{}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return "", protocol.Weapons{}, err
	}
	for i, weaponID := range robotProto.Weapons {
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponID)
		if err != nil {
			return "", protocol.Weapons{}, err
		}
		instanceID := fmt.Sprintf("weapon_%v", i)
		weapon := protocol.Weapon{
			ID:             instanceID,
			ProtoID:        weaponID,
			Title:          weaponProto.Title,
			Range:          weaponProto.Range,
			EnergyCost:     weaponProto.EnergyCost,
			MaxBulletCount: weaponProto.MaxBulletCount,
			Suitablility:   weaponProto.Suitablility,
			Ability:        weaponProto.Ability,
			EnergyType:     weaponProto.EnergyType,
			Type:           weaponProto.Type,
			Accuracy:       weaponProto.Accuracy,
			Damage:         weaponProto.Damage,
			Curage:         weaponProto.Curage,
			UnlockExp:      weaponProto.UnlockExp,
		}
		weapons[weapon.ID] = weapon
	}
	for weaponID, robotID := range model.App.Lobby.RobotIDByWeaponID {
		if robotID != robot.ID {
			continue
		}
		weapons[weaponID] = model.App.Lobby.Weapons[weaponID]
	}
	return robot.Transform, weapons, nil
}
