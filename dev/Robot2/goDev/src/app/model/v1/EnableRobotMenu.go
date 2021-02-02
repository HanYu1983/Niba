package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

// func (v *model) EnableRobotMenu(robotID string, situation interface{}) error {
// 	tags := v.App.Gameplay.Tags[robotID]
// 	if tags.IsDone {
// 		return fmt.Errorf("[EnableRobotMenu] robot(%v) already done", robotID)
// 	}
// 	options := [][]string{}
// 	rowFunctionMapping := map[int]int{}
// 	if tags.MoveCount == 0 {
// 		options = append(options, []string{uidata.MenuOptionMove})
// 	}
// 	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
// 	if err != nil {
// 		return err
// 	}
// 	_, weapons, err := QueryRobotWeapons(v.App, robot)
// 	if err != nil {
// 		return err
// 	}
// 	invalidWeapons := map[string]string{}
// 	if len(weapons) > 0 {
// 		rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
// 		options = append(options, protocol.KesStringWeapon(weapons))
// 		invalidWeapons, err = CheckInvalidWeapons(v.App, robot, weapons)
// 	}
// 	options = append(options, []string{uidata.MenuOptionUnitDone})
// 	v.App.Gameplay.RobotMenu.Active = true
// 	v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
// 	v.App.Gameplay.RobotMenu.Options = options
// 	v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
// 	v.App.Gameplay.RobotMenu.Weapons = weapons
// 	v.App.Gameplay.RobotMenu.InvalidWeapons = invalidWeapons
// 	log.Log(protocol.LogCategoryInfo, "EnableRobotMenu", fmt.Sprintf("robotID(%v) options(%v) tags(%v)\n", robotID, options, tags))
// 	return nil
// }

func EnableRobotMenu(origin model, robotID string, situation interface{}) (model, error) {
	v := origin
	tags := v.App.Gameplay.Tags[robotID]
	if tags.IsDone {
		return origin, fmt.Errorf("[EnableRobotMenu] robot(%v) already done", robotID)
	}
	options := [][]string{}
	rowFunctionMapping := map[int]int{}
	if tags.MoveCount == 0 {
		options = append(options, []string{uidata.MenuOptionMove})
	}
	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}
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
	options = append(options, []string{uidata.MenuOptionUnitDone})
	v.App.Gameplay.RobotMenu.Active = true
	v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
	v.App.Gameplay.RobotMenu.Options = options
	v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
	v.App.Gameplay.RobotMenu.Weapons = weapons
	v.App.Gameplay.RobotMenu.InvalidWeapons = invalidWeapons
	log.Log(protocol.LogCategoryInfo, "EnableRobotMenu", fmt.Sprintf("robotID(%v) options(%v) tags(%v)\n", robotID, options, tags))
	return v, nil
}
