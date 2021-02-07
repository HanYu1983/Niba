package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func QueryRobotWeapons(model model, robotID string, transform string) (protocol.Weapons, error) {
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return nil, err
	}
	if weapons, has := robot.WeaponsByTransform[transform]; has {
		return weapons, nil
	}
	weapons := protocol.Weapons{}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return protocol.Weapons{}, err
	}
	for i, weaponID := range robotProto.Weapons {
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponID)
		if err != nil {
			return protocol.Weapons{}, err
		}
		instanceID := fmt.Sprintf("weapon_%v", i)
		weapon := protocol.Weapon{
			ID:             instanceID,
			ProtoID:        weaponID,
			BulletCount:    weaponProto.MaxBulletCount,
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
		weapon := model.App.Lobby.Weapons[weaponID]
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
		if err != nil {
			return protocol.Weapons{}, err
		}
		instanceID := weapon.ID
		weaponState := protocol.Weapon{
			ID:             instanceID,
			ProtoID:        weaponID,
			BulletCount:    weaponProto.MaxBulletCount,
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
		weapons[weaponID] = weaponState
	}
	return weapons, nil
}
