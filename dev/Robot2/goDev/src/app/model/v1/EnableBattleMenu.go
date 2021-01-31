package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
)

func (v *model) EnableBattleMenu(robotID string, weaponID string, targetRobotID string) error {

	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return err
	}

	weapon, err := protocol.TryGetStringWeapon(robot.WeaponsByTransform[robot.Transform], weaponID)
	if err != nil {
		return err
	}

	targetRobot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return err
	}

	v.App.Gameplay.BattleMenu.Active = true
	v.App.Gameplay.BattleMenu.AttackRobot = robot
	v.App.Gameplay.BattleMenu.AttackWeapon = weapon
	v.App.Gameplay.BattleMenu.DeffenceRobot = targetRobot

	if targetRobot.PlayerID == protocol.PlayerIDPlayer {
		//  敵人打好人
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		weapons, err := QueryRobotWeapons(v.App, targetRobot)
		if err != nil {
			return err
		}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
		}
		options = append(options, []string{uidata.MenuOptionUnitGuard})
		options = append(options, []string{uidata.MenuOptionUnitEvade})

		v.App.Gameplay.RobotMenu.Active = true
		v.App.Gameplay.RobotMenu.ActiveRobotID = targetRobotID
		v.App.Gameplay.RobotMenu.Options = options
		v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
		v.App.Gameplay.RobotMenu.Weapons = weapons
	} else if robot.PlayerID == protocol.PlayerIDPlayer {
		// 好人打敵人
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		weapons, err := QueryRobotWeapons(v.App, robot)
		if err != nil {
			return err
		}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
		}
		v.App.Gameplay.RobotMenu.Active = true
		v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		v.App.Gameplay.RobotMenu.Options = options
		v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
		v.App.Gameplay.RobotMenu.Weapons = weapons
	}
	return nil
}
