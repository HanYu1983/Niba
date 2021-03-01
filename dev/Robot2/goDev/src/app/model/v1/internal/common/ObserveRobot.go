package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func ObserveRobot(model types.Model, robot protocol.Robot, isGameplay bool) (protocol.Robot, error) {
	log.Log(protocol.LogCategoryRender, "ObserveRobot", "start")
	log.Log(protocol.LogCategoryRender, "ObserveRobot", fmt.Sprintf("robot(%+v)", robot))
	var err error
	// MaxHP
	maxHP, err := QueryRobotMaxHp(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.MaxHP = maxHP
	// MaxEN
	maxEn, err := QueryRobotMaxEn(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.MaxEN = maxEn
	// Components
	components, err := QueryRobotComponents(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Components = components
	// Weapons
	weapons, err := QueryRobotWeapons(model, robot.ID, robot.Transform, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	weapons, err = ObserveWeapons(model, robot.ID, weapons, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Weapons = weapons
	// Title
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Title = robotProto.Title
	// Armor
	robot.Armor, err = QueryRobotArmor(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	// BeamArmor
	robot.BeamArmor, err = QueryRobotBeamArmor(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	// 這時不能給WeaponsByTransform付值，不然會QueryRobotWeapons會不正確。
	// if robot.WeaponsByTransform == nil {
	// 	return protocol.Robot{}, fmt.Errorf("ObserveRobot這時必須初始化這個欄位(WeaponsByTransform)")
	// }
	log.Log(protocol.LogCategoryRender, "ObserveRobot", "end")
	return robot, nil
}
