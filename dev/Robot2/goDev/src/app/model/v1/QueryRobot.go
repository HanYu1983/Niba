package v1

import (
	"app/tool/protocol"
)

func QueryRobot(model model, robotID string) (protocol.Robot, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return protocol.Robot{}, err
	}
	maxHP, err := QueryRobotMaxHp(model, robotID)
	if err != nil {
		return protocol.Robot{}, err
	}
	maxEn, err := QueryRobotMaxEn(model, robotID)
	if err != nil {
		return protocol.Robot{}, err
	}
	components, err := QueryRobotComponents(model, robotID)
	if err != nil {
		return protocol.Robot{}, err
	}
	weapons, err := QueryRobotWeapons(model, robotID, robot.Transform)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Components = components
	robot.WeaponsByTransform[robot.Transform] = weapons
	robot.MaxHP = maxHP
	robot.MaxEN = maxEn
	return robot, nil
}
