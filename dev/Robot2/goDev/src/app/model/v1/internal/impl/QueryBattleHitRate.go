package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/log"

	"github.com/go-gl/mathgl/mgl64"
)

type QueryBattleHitRateOptions struct {
	IgnoreSprayAttack bool
}

func QueryBattleHitRate(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot, options QueryBattleHitRateOptions) (float64, error) {
	log.Log(protocol.LogCategoryPhase, "QueryBattleHitRate", "start")
	var err error
	robotSuitability, err := common.QueryRobotSuitability(model, robot.ID, true)
	if err != nil {
		return 0, err
	}
	weaponAbility, err := common.QueryRobotWeaponAbility(model, robot.ID, weapon, true)
	if err != nil {
		return 0, err
	}

	isRangeAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "range"
	})) > 0
	isMeleeAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "melee"
	})) > 0
	isSprayAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "spray"
	})) > 0
	isFireAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "fire"
	})) > 0
	isLightingAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "lighting"
	})) > 0
	isMissileAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "missile"
	})) > 0
	if options.IgnoreSprayAttack == false {
		// 擴散攻擊一定命中
		if isSprayAttack {
			return 1, nil
		}
	}
	weaponSuitability, err := common.QueryRobotWeaponSuitability(model, robot.ID, weapon, true)
	if err != nil {
		return 0, err
	}
	pos := model.App.Gameplay.Positions[robot.ID]
	terrain, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, pos)
	if err != nil {
		return 0, err
	}
	targetPos := model.App.Gameplay.Positions[targetRobot.ID]
	targetTerrain, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
	if err != nil {
		return 0, err
	}
	robotSky := model.App.Gameplay.Tags[robot.ID].Sky
	targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
	powerFactor := 1.0
	{
		robotPower, err := common.QueryRobotMovePower(model, robot.ID, true)
		if err != nil {
			return 0, err
		}
		targetPower, err := common.QueryRobotMovePower(model, targetRobot.ID, true)
		if err != nil {
			return 0, err
		}
		switch {
		case isMissileAttack:
			// 飛彈攻擊會忽略剩餘出力影響
			// 所以剩餘出力越低的越適合使用飛彈
		default:
			powerFactor = (float64(robotPower) + 20.0) / (float64(targetPower) + 20.0)
		}
	}
	pilotRangeFactor := 1.0
	pilotHitRateFactor := 1.0
	{
		targetPilotEvade, err := common.QueryPilotEvade(model, targetRobot.ID, targetPilot.ID, true)
		if err != nil {
			return 0, err
		}

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
			pilotHitRateFactor = float64(pilotRange) / float64(targetPilotEvade)
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
			pilotHitRateFactor = float64(pilotMelee) / float64(targetPilotEvade)
		default:
			return 0, fmt.Errorf("[QueryBattleDamage]unknown attack type(melee or range). weapon(%+v)", weapon)
		}
		// 格鬥射擊分數佔比數較少
		pilotRangeFactor += ((1 - pilotRangeFactor) / 3)
	}
	robotSuitabilityFactor := 1.0
	{
		if robotSky {
			robotSuitabilityFactor = robotSuitability[data.SuitabilitySky]
		} else {
			factor := mgl64.Vec2{robotSuitability[0], robotSuitability[1]}.Dot(mgl64.Vec2{terrain.Cost[0], terrain.Cost[1]})
			robotSuitabilityFactor = factor
		}
		// 機體適性分數佔比數較少
		robotSuitabilityFactor += ((1 - robotSuitabilityFactor) / 1.1)
	}
	weaponSuitabilityFactor := 1.0
	{
		switch {
		case targetRobotSky:
			weaponSuitabilityFactor = weaponSuitability[data.SuitabilitySky]
		case isFireAttack && targetTerrain.ID == "forest":
			// 火焰攻擊對象不受地形補正
		case isLightingAttack && targetTerrain.ID == "shallowSea":
		case isLightingAttack && targetTerrain.ID == "deepSea":
			// 雷電攻擊對象不受地形補正
		default:
			factor := mgl64.Vec2{weaponSuitability[0], weaponSuitability[1]}.Dot(mgl64.Vec2{targetTerrain.Cost[0], targetTerrain.Cost[1]})
			weaponSuitabilityFactor = factor
		}
	}
	basic, err := common.QueryRobotWeaponAccuracy(model, robot.ID, weapon, true)
	if err != nil {
		return 0, err
	}
	basic += 0.25
	final := basic * powerFactor * pilotRangeFactor * robotSuitabilityFactor * weaponSuitabilityFactor * pilotHitRateFactor
	log.Log(protocol.LogCategoryDetail, "QueryBattleHitRate", fmt.Sprintf("final(%v) = basic(%v) * powerFactor(%v) * pilotRangeFactor(%v) * robotSuitabilityFactor(%v) * weaponSuitabilityFactor(%v) * pilotHitRateFactor(%v)", final, basic, powerFactor, pilotRangeFactor, robotSuitabilityFactor, weaponSuitabilityFactor, pilotHitRateFactor))
	log.Log(protocol.LogCategoryPhase, "QueryBattleHitRate", "end")
	return final, nil
}
