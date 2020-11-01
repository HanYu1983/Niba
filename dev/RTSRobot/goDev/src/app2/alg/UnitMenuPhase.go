package alg

import (
	"app2/data"
	"fmt"
)

func BattlePhase(origin data.Gameplay, robotID string, action interface{}, targetRobotID string, inputCh <-chan interface{}) (data.Gameplay, error) {
	gameplay := origin
	targetRobot, has := gameplay.Robots[targetRobotID]
	if has == false {
		return origin, fmt.Errorf("%v not found", targetRobotID)
	}
	robot, has := gameplay.Robots[robotID]
	if has == false {
		return origin, fmt.Errorf("%v not found", robotID)
	}
	if action == nil {
		return origin, fmt.Errorf("action is nil")
	}
	battleMenu := data.BattleMenu{}
	battleMenu.Robots[0] = robot
	battleMenu.Robots[1] = targetRobot
	battleMenu.BattleAction[0] = action
	battleMenu.BattleInfo[0].HitRate = 1

	if targetRobot.PlayerID == data.PlayerIDPlayer {

	} else {
		switch action.(type) {
		case data.BattleActionAttack:
			// AI thinking
			targetAction := data.BattleActionGuard{}
			battleMenu.BattleAction[1] = targetAction
			battleMenu.BattleInfo[1].HitRate = 1
		default:
			return origin, fmt.Errorf("must be BattleActionAttack")
		}
	}

	return gameplay, nil
}

func UnitMenuPhase(origin data.Gameplay, unitID string, inputCh <-chan interface{}) (data.Gameplay, error) {
	gameplay := origin
	if robot, is := gameplay.Robots[unitID]; is {
		gameplay, err := CreateRobotMenu(gameplay, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			gameplay, selection, cancel, err := SelectMenuStep(gameplay, inputCh)
			if err != nil {
				return origin, err
			}
			if cancel {
				break WaitMenu
			}
			switch gameplay.Menu.Cursor1 {
			case gameplay.Menu.WeaponID:
				weaponID := selection
				var _ = weaponID
				var targetID string

				gameplay, targetID, cancel, err = SelectUnitStep(gameplay, unitID, func(targetID string) error {
					return nil
				}, inputCh)

				if err != nil {
					return origin, err
				}
				if cancel {
					continue
				}
				var _ = targetID

			case gameplay.Menu.TransformID:
				transformID := selection
				nextRobot := gameplay.Robots[unitID]
				nextRobot.Transform = transformID
				gameplay.Robots = data.AssocStringRobot(gameplay.Robots, unitID, nextRobot)
			default:
				switch selection {
				case data.MenuOptionMove:
					gameplay, _, err = RobotMovePhase(gameplay, unitID, inputCh)
					if err != nil {
						Alert(err)
						continue
					}
				case data.MenuOptionSkyGround:
					tag := gameplay.Tags[unitID]
					tag.Sky = !tag.Sky
					gameplay.Tags = data.AssocStringTag(gameplay.Tags, unitID, tag)
				}
			}
		}
		return gameplay, nil
	}
	if item, is := gameplay.Items[unitID]; is {
		menu, err := CreateItemMenu(gameplay, item.ID)
		if err != nil {
			return origin, err
		}
		menu, selection, _, err := SelectMenuStep(menu, inputCh)
		if err != nil {
			return origin, err
		}
		var _ = selection
		return gameplay, nil
	}
	return origin, nil
}
