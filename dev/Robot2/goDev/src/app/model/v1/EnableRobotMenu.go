package v1

import (
	"app/tool/data"
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
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return origin, err
	}
	if robot.PlayerID == protocol.PlayerIDPlayer {
		// 選到自機
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		if tags.MoveCount == 0 {
			options = append(options, []string{uidata.MenuOptionMove})
		}
		// weapons
		weapons, err := QueryRobotWeapons(v, robot.ID, robot.Transform)
		if err != nil {
			return origin, err
		}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
		}
		// transform
		if tags.MoveCount == 0 {
			hasTransform := len(robotProto.Transform) > 0
			if hasTransform {
				rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionTransform
				options = append(options, robotProto.Transform)
			}
		}
		// sky ground
		if tags.MoveCount == 0 {
			suitabiity, err := QueryRobotSuitablility(v, robot.ID)
			if err != nil {
				return origin, err
			}
			isSky := v.App.Gameplay.Tags[robot.ID].Sky
			switch {
			case isSky == false && suitabiity[data.SuitabilitySky] > 0,
				isSky && suitabiity[data.SuitabilityGround] > 0:
				options = append(options, []string{uidata.MenuOptionSkyGround})
			}
		}
		// done
		options = append(options, []string{uidata.MenuOptionUnitDone})
		// invalidWeapons
		invalidWeapons := map[string]string{}
		if len(weapons) > 0 {
			invalidWeapons, err = CheckInvalidWeapons(v, robot, weapons)
		}
		v.App.Gameplay.RobotMenu.Active = true
		v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		v.App.Gameplay.RobotMenu.Options = options
		v.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
		v.App.Gameplay.RobotMenu.Weapons = weapons
		v.App.Gameplay.RobotMenu.InvalidWeapons = invalidWeapons
	} else {
		// 選到敵機
		// confirm
		options := [][]string{{uidata.MenuOptionConfirm}}
		v.App.Gameplay.RobotMenu.Active = true
		v.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		v.App.Gameplay.RobotMenu.Options = options
		v.App.Gameplay.RobotMenu.RowFunctionMapping = map[int]int{}
		v.App.Gameplay.RobotMenu.Weapons = map[string]protocol.Weapon{}
		v.App.Gameplay.RobotMenu.InvalidWeapons = map[string]string{}
	}

	log.Log(protocol.LogCategoryInfo, "EnableRobotMenu", fmt.Sprintf("RobotMenu(%v)\n", v.App.Gameplay.RobotMenu))
	return v, nil
}
