package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func QueryBattleHitRate(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (float64, error) {
	log.Log(protocol.LogCategoryPhase, "QueryBattleHitRate", "start")
	var err error
	powerFactor := 0.0
	{
		robotPower, err := common.QueryRobotMovePower(model, robot.ID, true)
		if err != nil {
			return 0, err
		}
		targetPower, err := common.QueryRobotMovePower(model, targetRobot.ID, true)
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
	pilotRangeFactor := 1.0
	{
		var weaponAbility []string
		weaponAbility, err = common.QueryRobotWeaponAbility(model, robot, weapon)
		if err != nil {
			return 0, err
		}
		isRangeAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
			return s == "range"
		})) > 0
		isMeleeAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
			return s == "melee"
		})) > 0
		switch {
		case isRangeAttack:
			pilotRange, err := common.QueryPilotRange(model, robot.ID, pilot.ID, true)
			if err != nil {
				return 0, err
			}
			targetPilotRange, err := common.QueryPilotRange(model, targetRobot.ID, targetPilot.ID, true)
			if err != nil {
				return 0, err
			}
			pilotRangeFactor = float64(pilotRange) / float64(targetPilotRange)
		case isMeleeAttack:
			pilotMelee, err := common.QueryPilotMelee(model, robot.ID, pilot.ID, true)
			if err != nil {
				return 0, err
			}
			targetPilotMelee, err := common.QueryPilotMelee(model, targetRobot.ID, targetPilot.ID, true)
			if err != nil {
				return 0, err
			}
			pilotRangeFactor = float64(pilotMelee) / float64(targetPilotMelee)
		default:
			return 0, fmt.Errorf("[QueryBattleDamage]unknown attack type(melee or range). weapon(%+v)", weapon)
		}
	}
	basic, err := common.QueryRobotWeaponAccuracy(model, robot, weapon)
	if err != nil {
		return 0, err
	}
	final := basic * powerFactor * terrainFactor * pilotRangeFactor
	log.Log(protocol.LogCategoryPhase, "QueryBattleHitRate", "end")
	return final, nil
}
