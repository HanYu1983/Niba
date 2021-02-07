package v1

import "app/tool/protocol"

func ObserveRobot(model model, robot protocol.Robot) (protocol.Robot, error) {
	var err error
	maxHP, err := QueryRobotMaxHp(model, robot.ID)
	if err != nil {
		return protocol.Robot{}, err
	}
	maxEn, err := QueryRobotMaxEn(model, robot.ID)
	if err != nil {
		return protocol.Robot{}, err
	}
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return protocol.Robot{}, err
	}
	weapons, err := QueryRobotWeapons(model, robot.ID, robot.Transform)
	if err != nil {
		return protocol.Robot{}, err
	}
	for ID, weapon := range weapons {
		weapons[ID], err = ObserveWeapon(model, robot, weapon)
		if err != nil {
			return protocol.Robot{}, err
		}
	}
	robot.MaxHP = maxHP
	robot.MaxEN = maxEn
	robot.Components = components
	robot.WeaponsByTransform[robot.Transform] = weapons
	return robot, nil
}
