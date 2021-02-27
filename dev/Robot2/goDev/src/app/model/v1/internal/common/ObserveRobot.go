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
	if robot.WeaponsByTransform == nil {
		return protocol.Robot{}, fmt.Errorf("ObserveRobot這時必須初始化這個欄位(WeaponsByTransform)")
	}
	maxHP, err := QueryRobotMaxHp(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	maxEn, err := QueryRobotMaxEn(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	components, err := QueryRobotComponents(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	weapons, err := QueryRobotWeapons(model, robot.ID, robot.Transform, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	weapons, err = ObserveWeapons(model, robot, weapons)
	if err != nil {
		return protocol.Robot{}, err
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Title = robotProto.Title
	robot.MaxHP = maxHP
	robot.MaxEN = maxEn
	robot.Armor, err = QueryRobotArmor(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.BeamArmor, err = QueryRobotBeamArmor(model, robot.ID, isGameplay)
	if err != nil {
		return protocol.Robot{}, err
	}
	robot.Components = components
	robot.WeaponsByTransform[robot.Transform] = weapons
	log.Log(protocol.LogCategoryRender, "ObserveRobot", "end")
	return robot, nil
}
