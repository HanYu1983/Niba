package alg

import "app/data"

func GetRobotWeapons(origin data.Gameplay, robot data.Robot) (data.Weapons, error) {
	if weapons, has := robot.WeaponsByTransform[robot.Transform]; has {
		return weapons, nil
	}
	weapons := data.Weapons{}
	for weaponID, robotID := range origin.Lobby.RobotIDByWeaponID {
		if robotID != robot.ID {
			continue
		}
		weapons[weaponID] = origin.Lobby.Weapons[weaponID]
	}
	return weapons, nil
}
