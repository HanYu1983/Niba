package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
)

func ObserveRobot(model types.Model, robot protocol.Robot) (protocol.Robot, error) {
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
	weapons, err = ObserveWeapons(model, robot, weapons)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.MaxHP = maxHP
	robot.MaxEN = maxEn
	robot.Armor, err = QueryRobotArmor(model, robot.ID)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.BeamArmor, err = QueryRobotBeamArmor(model, robot.ID)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Components = components
	robot.WeaponsByTransform[robot.Transform] = weapons
	return robot, nil
}
