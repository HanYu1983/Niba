package gameplay

import "app/tool/data"

func GetRobotWeapons(origin data.Gameplay, robot protocol.Robot) (protocol.Weapons, error) {
	if weapons, has := robot.WeaponsByTransform[robot.Transform]; has {
		return weapons, nil
	}
	weapons := protocol.Weapons{}
	for weaponID, robotID := range origin.Lobby.RobotIDByWeaponID {
		if robotID != robot.ID {
			continue
		}
		weapons[weaponID] = origin.Lobby.Weapons[weaponID]
	}
	return weapons, nil
}
