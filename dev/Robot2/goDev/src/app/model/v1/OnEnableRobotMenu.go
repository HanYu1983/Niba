package v1

import (
	"app/model/v1/internal/impl"
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnEnableRobotMenu(origin uidata.UI, robotID string) (uidata.UI, error) {
	ctx := origin
	_model := impl.Model(ctx.Model.(Model))
	tags := _model.App.Gameplay.Tags[robotID]
	if tags.IsDone {
		return origin, fmt.Errorf("[EnableRobotMenu] robot(%v) already done", robotID)
	}
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
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
		weapons, err := impl.QueryRobotWeapons(_model, robot.ID, robot.Transform)
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
			suitabiity, err := impl.QueryRobotSuitability(_model, robot.ID)
			if err != nil {
				return origin, err
			}
			isSky := _model.App.Gameplay.Tags[robot.ID].Sky
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
			invalidWeapons, err = impl.CheckInvalidWeapons(_model, robot, weapons)
		}
		_model.App.Gameplay.RobotMenu.Active = true
		_model.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		_model.App.Gameplay.RobotMenu.Options = options
		_model.App.Gameplay.RobotMenu.RowFunctionMapping = rowFunctionMapping
		_model.App.Gameplay.RobotMenu.Weapons = weapons
		_model.App.Gameplay.RobotMenu.InvalidWeapons = invalidWeapons
	} else {
		// 選到敵機
		// confirm
		options := [][]string{{uidata.MenuOptionConfirm}}
		_model.App.Gameplay.RobotMenu.Active = true
		_model.App.Gameplay.RobotMenu.ActiveRobotID = robotID
		_model.App.Gameplay.RobotMenu.Options = options
		_model.App.Gameplay.RobotMenu.RowFunctionMapping = map[int]int{}
		_model.App.Gameplay.RobotMenu.Weapons = map[string]protocol.Weapon{}
		_model.App.Gameplay.RobotMenu.InvalidWeapons = map[string]string{}
	}
	{
		// 重設Cursor
		menu, err := uidata.TryGetIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		menu.Cursor1 = 0
		ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu, menu)
	}
	log.Log(protocol.LogCategoryDetail, "EnableRobotMenu", fmt.Sprintf("RobotMenu(%v)\n", _model.App.Gameplay.RobotMenu))
	// apply
	ctx.Model = Model(_model)
	return ctx, nil
}
