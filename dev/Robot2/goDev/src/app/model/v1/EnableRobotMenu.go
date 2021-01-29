package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func (v *model) EnableRobotMenu(robotID string, situation interface{}) error {
	tags := v.App.Gameplay.Tags[robotID]
	if tags.IsDone {
		return fmt.Errorf("[EnableRobotMenu] robot(%v) already done", robotID)
	}
	options := [][]string{}
	rowFunctionMapping := map[int]int{}
	if tags.MoveCount == 0 {
		options = append(options, []string{uidata.MenuOptionMove})
	}
	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return err
	}
	weapons, err := QueryRobotWeapons(v.App, robot)
	if err != nil {
		return err
	}
	if len(weapons) > 0 {
		rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
		options = append(options, protocol.KesStringWeapon(weapons))
	}
	options = append(options, []string{uidata.MenuOptionUnitDone})
	v.App.Gameplay.RobotMenu.Active = true
	v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
	v.App.Gameplay.RobotMenu.Options = options
	v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
	v.App.Gameplay.RobotMenu.Weapons = weapons
	log.Log(protocol.LogCategoryInfo, "EnableRobotMenu", fmt.Sprintf("robotID(%v) options(%v) tags(%v)\n", robotID, options, tags))
	return nil
}
