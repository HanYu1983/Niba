package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnEnableBattleMenu(origin uidata.UI, robotID string, weaponID string, targetRobotID string) (uidata.UI, error) {
	ctx := origin
	_model := types.Model(origin.Model.(Model))
	robot, err := common.QueryRobot(_model, robotID, true)
	if err != nil {
		return origin, err
	}

	pilot, err := common.QueryPilot(_model, robot.PilotID, true)
	if err != nil {
		return origin, err
	}

	targetRobot, err := common.QueryRobot(_model, targetRobotID, true)
	if err != nil {
		return origin, err
	}

	targetPilot, err := common.QueryPilot(_model, targetRobot.PilotID, true)
	if err != nil {
		return origin, err
	}

	// battleMenu
	battleMenu := _model.App.Gameplay.BattleMenu
	{
		weapons, err := common.QueryRobotWeapons(_model, robot.ID, robot.Transform, true)
		weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
		if err != nil {
			return origin, err
		}
		battleMenu.Active = true
		battleMenu.AttackRobot = robot
		battleMenu.AttackPilot = pilot
		battleMenu.AttackWeapon = weapon
		battleMenu.DeffenceRobot = targetRobot
		battleMenu.DeffencePilot = targetPilot
	}

	// robotMenu
	robotMenu := _model.App.Gameplay.RobotMenu
	{
		if targetRobot.PlayerID == protocol.PlayerIDPlayer {
			//  敵人打好人
			options := [][]string{}
			rowFunctionMapping := map[int]int{}
			// weapons
			weapons, err := common.QueryRobotWeapons(_model, targetRobot.ID, targetRobot.Transform, true)
			if err != nil {
				return origin, err
			}
			weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				invalieStr, err := common.CheckInvalidWeapon(_model, targetRobot.ID, weapon, []string{robot.ID}, nil)
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
				invalidWeapons, err = common.CheckInvalidWeapons(_model, targetRobot.ID, weapons, nil)
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
			weapons, err := common.QueryRobotWeapons(_model, robot.ID, robot.Transform, true)
			if err != nil {
				return origin, err
			}
			weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				invalieStr, err := common.CheckInvalidWeapon(_model, robot.ID, weapon, []string{targetRobot.ID}, nil)
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
				invalidWeapons, err = common.CheckInvalidWeapons(_model, robot.ID, weapons, nil)
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
	ctx.Model = Model(_model)
	{
		// 重設Cursor
		menu, err := uidata.TryGetIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		menu.Cursor1 = 0
		ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu, menu)
	}
	log.Log(protocol.LogCategoryInfo, "EnableBattleMenu", fmt.Sprintf("end. BattleMenu(%v)\n", battleMenu))
	return ctx, nil
}
