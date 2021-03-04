package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"math"
	"tool/log"

	"github.com/go-gl/mathgl/mgl64"
)

var (
	terrainCache map[protocol.Position]data.TerrainProto
)

func QueryBattleDamage(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (int, error) {
	var err error
	robotSuitability, err := common.QueryRobotSuitability(model, robot.ID, true)
	if err != nil {
		return 0, err
	}
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
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
	isBeanAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "beam"
	})) > 0
	isPhysicAttack := len(tool.FilterString(weaponAbility, func(s string) bool {
		return s == "physic"
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
	targetArmor := 0
	{
		targetArmor, err = common.QueryRobotArmor(model, robot.ID, true)
		if err != nil {
			return 0, err
		}
		switch {
		case isBeanAttack:
			targetArmor, err = common.QueryRobotBeamArmor(model, robot.ID, true)
			if err != nil {
				return 0, err
			}
		case isPhysicAttack:
			targetArmor, err = common.QueryRobotArmor(model, robot.ID, true)
			if err != nil {
				return 0, err
			}
		case isFireAttack:
		case isLightingAttack:
		case isMissileAttack:
		default:
			return 0, fmt.Errorf("[QueryBattleDamage]unknown attack type. weapon(%+v)", weapon)
		}
	}
	pilotRangeFactor := 1.0
	{
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
	pilotAtkFactor := 1.0
	{
		pilotAtk, err := common.QueryPilotAtk(model, robot.ID, pilot.ID, true)
		if err != nil {
			return 0, err
		}
		pilotGuard, err := common.QueryPilotGuard(model, targetRobot.ID, targetPilot.ID, true)
		if err != nil {
			return 0, err
		}
		pilotAtkFactor = float64(pilotAtk) / float64(pilotGuard)
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
	basicDamage := weaponProto.Damage - targetArmor
	finalDamage := float64(basicDamage) * pilotRangeFactor * pilotAtkFactor * robotSuitabilityFactor * weaponSuitabilityFactor
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("basicDamage(%v) = weapon.Damage(%v) - targetArmor(%v)", basicDamage, weapon.Damage, targetArmor))
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("finalDamage(%v) = basicDamage(%v) * pilotRangeFactor(%v) * pilotAtkFactor(%v) *  robotSuitabilityFactor(%v) * weaponSuitabilityFactor(%v)", finalDamage, basicDamage, pilotRangeFactor, pilotAtkFactor, robotSuitabilityFactor, weaponSuitabilityFactor))
	if isSprayAttack {
		hitRate, err := QueryBattleHitRate(model, robot, pilot, weapon, targetRobot, targetPilot, QueryBattleHitRateOptions{IgnoreSprayAttack: true})
		if err != nil {
			return 0, err
		}
		finalDamage *= hitRate
		log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("finalDamage(%v) after spray effect(%v)", finalDamage, hitRate))
	}
	return int(math.Max(0, finalDamage)), nil
}
