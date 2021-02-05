package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func EnableRobotMenu(origin model, robotID string, situation interface{}) (model, error) {
	v := origin
	tags := v.App.Gameplay.Tags[robotID]
	if tags.IsDone {
		return origin, fmt.Errorf("[EnableRobotMenu] robot(%v) already done", robotID)
	}
	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}
	if robot.PlayerID == protocol.PlayerIDPlayer {
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		if tags.MoveCount == 0 {
			options = append(options, []string{uidata.MenuOptionMove})
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
	} else {
		v.App.Gameplay.RobotMenu.Active = true
		v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		v.App.Gameplay.RobotMenu.Options = [][]string{{uidata.MenuOptionConfirm}}
		v.App.Gameplay.RobotMenu.RowFunctionMapping = map[int]int{}
		v.App.Gameplay.RobotMenu.Weapons = map[string]protocol.Weapon{}
		v.App.Gameplay.RobotMenu.InvalidWeapons = map[string]string{}
	}

	log.Log(protocol.LogCategoryInfo, "EnableRobotMenu", fmt.Sprintf("RobotMenu(%v)\n", v.App.Gameplay.RobotMenu))
	return v, nil
}
