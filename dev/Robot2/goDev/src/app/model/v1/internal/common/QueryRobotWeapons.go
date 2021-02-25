package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotWeapons(model types.Model, robotID string, transform string) (protocol.Weapons, error) {
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return nil, err
	}
	if weapons, has := robot.WeaponsByTransform[transform]; has {
		return weapons, nil
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return protocol.Weapons{}, err
	}
	weapons := protocol.Weapons{}
	for _, weaponProtoID := range robotProto.Weapons {
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponProtoID)
		if err != nil {
			return protocol.Weapons{}, err
		}
		weapon := protocol.Weapon{
			ID:          weaponProtoID, // 直接使用ProtoID, 讓變形時狀態能繼承
			ProtoID:     weaponProtoID,
			BulletCount: weaponProto.MaxBulletCount,
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
		weaponState := protocol.Weapon{
			ID:          weapon.ID,
			ProtoID:     weapon.ProtoID,
			BulletCount: weaponProto.MaxBulletCount,
		}
		weapons[weaponState.ID] = weaponState
	}

	return weapons, nil
}