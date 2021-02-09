package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
)

func QueryBattleHitRate(model model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (float64, error) {
	var err error
	powerFactor := 0.0
	{
		robotPower, err := QueryRobotMovePower(model, robot.ID)
		if err != nil {
			return 0, err
		}
		targetPower, err := QueryRobotMovePower(model, targetRobot.ID)
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
			terrain := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
			terrainFactor = terrain.HitRate
		}
	}
	basic, err := QueryRobotWeaponAccuracy(model, robot, weapon)
	if err != nil {
		return 0, err
	}
	final := basic * powerFactor * terrainFactor
	return final, nil
}
