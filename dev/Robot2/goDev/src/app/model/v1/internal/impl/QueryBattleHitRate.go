package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/helper"
	"app/tool/protocol"
)

func QueryBattleHitRate(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (float64, error) {
	var err error
	powerFactor := 0.0
	{
		robotPower, err := common.QueryRobotMovePower(model, robot.ID)
		if err != nil {
			return 0, err
		}
		targetPower, err := common.QueryRobotMovePower(model, targetRobot.ID)
		if err != nil {
			return 0, err
		}
		powerFactor = (float64(robotPower) + 100.0) / (float64(targetPower) + 100.0)
	}
	terrainFactor := 1.0
	{
		targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
		if targetRobotSky == false {
			targetPos := model.App.Gameplay.Positions[targetRobot.ID]
			terrain, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
			if err != nil {
				return 0, err
			}
			terrainFactor = terrain.HitRate
		}
	}
	basic, err := common.QueryRobotWeaponAccuracy(model, robot, weapon)
	if err != nil {
		return 0, err
	}
	final := basic * powerFactor * terrainFactor
	return final, nil
}
