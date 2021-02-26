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
)

var (
	terrainCache map[protocol.Position]data.TerrainProto
)

func QueryBattleDamage(model types.Model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (int, error) {
	var err error
	targetArmor := 0
	{
		var weaponAbility []string
		weaponAbility, err = common.QueryRobotWeaponAbility(model, robot, weapon)
		if err != nil {
			return 0, err
		}
		targetArmor, err = common.QueryRobotArmor(model, robot.ID, true)
		if err != nil {
			return 0, err
		}
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
	terrainFactor := 1.0
	{
		targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
		if targetRobotSky == false {
			targetPos := model.App.Gameplay.Positions[targetRobot.ID]
			terrain, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
			if err != nil {
				return 0, err
			}
			terrainFactor = terrain.Damage
		}
	}
	suitabilityFactor := 1.0
	{
		weaponSuitability, err := common.QueryRobotWeaponSuitability(model, robot, weapon)
		if err != nil {
			return 0, err
		}
		targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
		if targetRobotSky {
			suitabilityFactor = weaponSuitability[data.SuitabilitySky]
		} else {
			targetPos := model.App.Gameplay.Positions[targetRobot.ID]
			terrain, err := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
			if err != nil {
				return 0, err
			}
			switch terrain.ID {
			case "shallowSea", "deepSea":
				suitabilityFactor = weaponSuitability[data.SuitabilitySea]
			case "mountain", "plain", "forest", "road", "city", "beach", "award":
				suitabilityFactor = weaponSuitability[data.SuitabilityGround]
			default:
				return 0, fmt.Errorf("unknown terrain(%v)", terrain.ID)
			}
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
	basicDamage := weapon.Damage - targetArmor
	finalDamage := float64(basicDamage) * terrainFactor * suitabilityFactor * pilotRangeFactor * pilotAtkFactor
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("basicDamage(%v) = weapon.Damage(%v) - targetArmor(%v)", basicDamage, weapon.Damage, targetArmor))
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("finalDamage(%v) = basicDamage(%v) * terrainFactor(%v) * suitabilityFactor(%v) * pilotRangeFactor(%v) * pilotAtkFactor(%v)", finalDamage, basicDamage, terrainFactor, suitabilityFactor, pilotRangeFactor, pilotAtkFactor))
	return int(math.Max(0, finalDamage)), nil
}
