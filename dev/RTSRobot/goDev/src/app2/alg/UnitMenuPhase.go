package alg

import (
	"app2/data"
)

func UnitMenuPhase(origin data.Gameplay, unitID string, inputCh <-chan interface{}) (data.Gameplay, error) {
	gameplay := origin
	if robot, is := gameplay.Robots[unitID]; is {
		menu, err := CreateRobotMenu(gameplay, robot.ID)
		if err != nil {
			return origin, err
		}
	WaitMenu:
		for {
			menu, selection, cancel, err := SelectMenuStep(menu, inputCh)
			if err != nil {
				return origin, err
			}
			if cancel {
				break WaitMenu
			}
			switch menu.Cursor[0] {
			case menu.WeaponID:
				weaponID := selection
				var _ = weaponID
			case menu.TransformID:
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
