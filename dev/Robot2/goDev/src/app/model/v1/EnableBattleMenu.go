package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

// func (v *model) EnableBattleMenu(robotID string, weaponID string, targetRobotID string) error {

// 	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
// 	if err != nil {
// 		return err
// 	}

// 	_, weapons, err := QueryRobotWeapons(v.App, robot)
// 	weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
// 	if err != nil {
// 		return err
// 	}

// 	targetRobot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, targetRobotID)
// 	if err != nil {
// 		return err
// 	}

// 	battleMenu := v.App.Gameplay.BattleMenu
// 	battleMenu.Active = true
// 	battleMenu.AttackRobot = robot
// 	battleMenu.AttackWeapon = weapon
// 	battleMenu.DeffenceRobot = targetRobot

// 	robotMenu := v.App.Gameplay.RobotMenu

// 	if targetRobot.PlayerID == protocol.PlayerIDPlayer {
// 		//  敵人打好人
// 		options := [][]string{}
// 		rowFunctionMapping := map[int]int{}
// 		_, weapons, err := QueryRobotWeapons(v.App, targetRobot)
// 		if err != nil {
// 			return err
// 		}
// 		invalidWeapons := map[string]string{}
// 		if len(weapons) > 0 {
// 			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
// 			options = append(options, protocol.KesStringWeapon(weapons))
// 			invalidWeapons, err = CheckInvalidWeapons(v.App, robot, weapons)
// 		}
// 		options = append(options, []string{uidata.MenuOptionUnitGuard})
// 		options = append(options, []string{uidata.MenuOptionUnitEvade})

// 		robotMenu.Active = true
// 		robotMenu.ActiveRobotID = targetRobotID
// 		robotMenu.Options = options
// 		robotMenu.RowFunctionMapping = rowFunctionMapping
// 		robotMenu.Weapons = weapons
// 		robotMenu.InvalidWeapons = invalidWeapons
// 	} else if robot.PlayerID == protocol.PlayerIDPlayer {
// 		// 好人打敵人
// 		options := [][]string{}
// 		rowFunctionMapping := map[int]int{}
// 		_, weapons, err := QueryRobotWeapons(v.App, robot)
// 		if err != nil {
// 			return err
// 		}
// 		invalidWeapons := map[string]string{}
// 		if len(weapons) > 0 {
// 			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
// 			options = append(options, protocol.KesStringWeapon(weapons))
// 			invalidWeapons, err = CheckInvalidWeapons(v.App, robot, weapons)
// 		}
// 		robotMenu.Active = true
// 		robotMenu.ActiveRobotID = robotID
// 		robotMenu.Options = options
// 		robotMenu.RowFunctionMapping = rowFunctionMapping
// 		robotMenu.Weapons = weapons
// 		robotMenu.InvalidWeapons = invalidWeapons
// 	} else {
// 		return fmt.Errorf("unknown situation. robot(%+v) targetRobot(%+v)", robot, targetRobot)
// 	}

// 	v.App.Gameplay.BattleMenu = battleMenu
// 	v.App.Gameplay.RobotMenu = robotMenu
// 	return nil
// }

func EnableBattleMenu(origin model, robotID string, weaponID string, targetRobotID string) (model, error) {
	v := origin
	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}

	_, weapons, err := QueryRobotWeapons(v.App, robot)
	weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
	if err != nil {
		return origin, err
	}

	targetRobot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return origin, err
	}

	battleMenu := v.App.Gameplay.BattleMenu
	battleMenu.Active = true
	battleMenu.AttackRobot = robot
	battleMenu.AttackWeapon = weapon
	battleMenu.DeffenceRobot = targetRobot

	robotMenu := v.App.Gameplay.RobotMenu

	if targetRobot.PlayerID == protocol.PlayerIDPlayer {
		//  敵人打好人
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		_, weapons, err := QueryRobotWeapons(v.App, targetRobot)
		if err != nil {
			return origin, err
		}
		invalidWeapons := map[string]string{}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
			invalidWeapons, err = CheckInvalidWeapons(v.App, robot, weapons)
		}
		options = append(options, []string{uidata.MenuOptionUnitGuard})
		options = append(options, []string{uidata.MenuOptionUnitEvade})

		robotMenu.Active = true
		robotMenu.ActiveRobotID = targetRobotID
		robotMenu.Options = options
		robotMenu.RowFunctionMapping = rowFunctionMapping
		robotMenu.Weapons = weapons
		robotMenu.InvalidWeapons = invalidWeapons
	} else if robot.PlayerID == protocol.PlayerIDPlayer {
		// 好人打敵人
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		_, weapons, err := QueryRobotWeapons(v.App, robot)
		if err != nil {
			return origin, err
		}
		invalidWeapons := map[string]string{}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
			invalidWeapons, err = CheckInvalidWeapons(v.App, robot, weapons)
		}
		robotMenu.Active = true
		robotMenu.ActiveRobotID = robotID
		robotMenu.Options = options
		robotMenu.RowFunctionMapping = rowFunctionMapping
		robotMenu.Weapons = weapons
		robotMenu.InvalidWeapons = invalidWeapons
	} else {
		return origin, fmt.Errorf("unknown situation. robot(%+v) targetRobot(%+v)", robot, targetRobot)
	}

	v.App.Gameplay.BattleMenu = battleMenu
	v.App.Gameplay.RobotMenu = robotMenu

	log.Log(protocol.LogCategoryInfo, "EnableBattleMenu", fmt.Sprintf("end. BattleMenu(%v)\n", battleMenu))
	return v, nil
}
