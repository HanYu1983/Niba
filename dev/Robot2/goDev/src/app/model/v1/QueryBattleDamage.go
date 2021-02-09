package v1

import (
	"app/tool"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"math"
	"strconv"
	"tool/log"
)

func QueryRobotArmor(model model, robotID string) (int, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return 0, err
	}
	total := 0
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "armor1", "armor2", "armor3", "armor4", "armor5":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[1], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	return total, nil
}

func QueryRobotBeamArmor(model model, robotID string) (int, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return 0, err
	}
	total := 0
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "beam_armor1", "beam_armor2", "beam_armor3", "beam_armor4", "beam_armor5":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[1], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	return total, nil
}

func QueryPilotRange(model model) {

}

func QueryBattleDamage(model model, robot protocol.Robot, pilot protocol.Pilot, weapon protocol.Weapon, targetRobot protocol.Robot, targetPilot protocol.Pilot) (int, error) {
	var err error
	targetArmor := 0
	{
		var weaponAbility []string
		weaponAbility, err = QueryRobotWeaponAbility(model, robot, weapon)
		if err != nil {
			return 0, err
		}
		targetArmor, err = QueryRobotArmor(model, robot.ID)
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
		switch {
		case isBeanAttack:
			targetArmor, err = QueryRobotBeamArmor(model, robot.ID)
			if err != nil {
				return 0, err
			}
		case isPhysicAttack:
			targetArmor, err = QueryRobotArmor(model, robot.ID)
			if err != nil {
				return 0, err
			}
		case isFireAttack:
		case isLightingAttack:
		default:
			return 0, fmt.Errorf("unknown attack type. (%v)", weapon)
		}
	}
	terrainFactor := 1.0
	{
		targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
		if targetRobotSky == false {
			targetPos := model.App.Gameplay.Positions[targetRobot.ID]
			terrain := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
			terrainFactor = terrain.Damage
		}
	}
	suitabilityFactor := 1.0
	{
		weaponSuitability, err := QueryRobotWeaponSuitability(model, robot, weapon)
		if err != nil {
			return 0, err
		}
		targetRobotSky := model.App.Gameplay.Tags[targetRobot.ID].Sky
		if targetRobotSky {
			suitabilityFactor = weaponSuitability[data.SuitabilitySky]
		} else {
			targetPos := model.App.Gameplay.Positions[targetRobot.ID]
			terrain := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, targetPos)
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
	pilotFactor := 1.0
	{

	}
	basicDamage := weapon.Damage - targetArmor
	finalDamage := float64(basicDamage) * terrainFactor * suitabilityFactor * pilotFactor
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("basicDamage(%v) = weapon.Damage(%v) - targetArmor(%v)", basicDamage, weapon.Damage, targetArmor))
	log.Log(protocol.LogCategoryDetail, "QueryBattleDamage", fmt.Sprintf("finalDamage(%v) = basicDamage(%v) * terrainFactor(%v) * suitabilityFactor(%v) * pilotFactor(%v)", finalDamage, basicDamage, terrainFactor, suitabilityFactor, pilotFactor))
	return int(math.Max(0, finalDamage)), nil
}
