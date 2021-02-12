package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnEnableBattleMenu(origin uidata.UI, robotID string, weaponID string, targetRobotID string) (uidata.UI, error) {
	ctx := origin
	_model := origin.Model.(model)
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}

	targetRobot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return origin, err
	}

	// battleMenu
	battleMenu := _model.App.Gameplay.BattleMenu
	{
		weapons, err := QueryRobotWeapons(_model, robot.ID, robot.Transform)
		weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
		if err != nil {
			return origin, err
		}
		battleMenu.Active = true
		battleMenu.AttackRobot = robot
		battleMenu.AttackWeapon = weapon
		battleMenu.DeffenceRobot = targetRobot
	}

	// robotMenu
	robotMenu := _model.App.Gameplay.RobotMenu
	{
		if targetRobot.PlayerID == protocol.PlayerIDPlayer {
			//  敵人打好人
			options := [][]string{}
			rowFunctionMapping := map[int]int{}
			// weapons
			weapons, err := QueryRobotWeapons(_model, targetRobot.ID, targetRobot.Transform)
			if err != nil {
				return origin, err
			}
			weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				invalieStr, err := CheckInvalidWeapon(_model, targetRobot, weapon, []string{robot.ID})
				if err != nil {
					log.Log(protocol.LogCategoryWarning, "EnableBattleMenu", err.Error())
					return false
				}
				return invalieStr == ""
			})
			if len(weapons) > 0 {
				rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
				options = append(options, protocol.KesStringWeapon(weapons))
			}
			// guard, evade
			{
				options = append(options, []string{uidata.MenuOptionUnitGuard})
				options = append(options, []string{uidata.MenuOptionUnitEvade})
			}
			// invalidWeapons
			invalidWeapons := map[string]string{}
			if len(weapons) > 0 {
				invalidWeapons, err = CheckInvalidWeapons(_model, robot, weapons)
			}
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
			// weapons
			weapons, err := QueryRobotWeapons(_model, robot.ID, robot.Transform)
			if err != nil {
				return origin, err
			}
			weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				invalieStr, err := CheckInvalidWeapon(_model, robot, weapon, []string{targetRobot.ID})
				if err != nil {
					log.Log(protocol.LogCategoryWarning, "EnableBattleMenu", err.Error())
					return false
				}
				return invalieStr == ""
			})
			if len(weapons) > 0 {
				rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
				options = append(options, protocol.KesStringWeapon(weapons))
			} else {
				return origin, fmt.Errorf("這時必須有武器可以選")
			}
			// invalidWeapons
			invalidWeapons := map[string]string{}
			if len(weapons) > 0 {
				invalidWeapons, err = CheckInvalidWeapons(_model, robot, weapons)
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
	}
	// apply
	_model.App.Gameplay.BattleMenu = battleMenu
	_model.App.Gameplay.RobotMenu = robotMenu
	ctx.Model = _model
	log.Log(protocol.LogCategoryInfo, "EnableBattleMenu", fmt.Sprintf("end. BattleMenu(%v)\n", battleMenu))
	return ctx, nil
}
