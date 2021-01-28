package gameplay

import (
	"app/tool/data"
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
	if targetRobot.PlayerID == protocol.PlayerIDPlayer {

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

func UnitMenuPhase(origin data.Gameplay, unitID string) (data.Gameplay, error) {
	gameplay := origin
	if len(gameplay.MenuStack) == 0 {
		return origin, fmt.Errorf("must have menu")
	}
	if robot, is := gameplay.Robots[unitID]; is {
		// append menu
		gameplay, err := CreateRobotMenu(gameplay, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			gameplay, selection, cancel, err := SelectMenuStep(gameplay)
			if err != nil {
				return origin, err
			}
			if cancel {
				break WaitMenu
			}
			topMenu := gameplay.MenuStack[len(gameplay.MenuStack)-1]
			switch topMenu.Cursor1 {
			case topMenu.WeaponID:
				weaponID := selection
				var _ = weaponID
				var targetID string
				gameplay, targetID, cancel, err = SelectUnitStep(gameplay, unitID, func(targetID string) error {
					return nil
				})
				if err != nil {
					return origin, err
				}
				if cancel {
					continue
				}
				var _ = targetID
			case topMenu.TransformID:
				transformID := selection
				nextRobot := gameplay.Robots[unitID]
				nextRobot.Transform = transformID
				gameplay.Robots = protocol.AssocStringRobot(gameplay.Robots, unitID, nextRobot)
			default:
				switch selection {
				case data.MenuOptionMove:
					gameplay, _, err = RobotMovePhase(gameplay, unitID)
					if err != nil {
						view.Alert(err)
						continue
					}
				case data.MenuOptionSkyGround:
					tag := gameplay.Tags[unitID]
					tag.Sky = !tag.Sky
					gameplay.Tags = data.AssocStringTag(gameplay.Tags, unitID, tag)
				}
			}
		}
		// pop menu
		gameplay.MenuStack = gameplay.MenuStack[:len(gameplay.MenuStack)-1]
		return gameplay, nil
	}
	if item, is := gameplay.Items[unitID]; is {
		// append menu
		gameplay, err := CreateItemMenu(gameplay, item.ID)
		if err != nil {
			return origin, err
		}
		gameplay, selection, _, err := SelectMenuStep(gameplay)
		if err != nil {
			return origin, err
		}
		var _ = selection
		// pop menu
		gameplay.MenuStack = gameplay.MenuStack[:len(gameplay.MenuStack)-1]
		return gameplay, nil
	}
	return origin, nil
}
