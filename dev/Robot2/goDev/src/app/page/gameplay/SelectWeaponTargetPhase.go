package gameplay

import (
	"app/page/common"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func SelectWeaponTargetPhase(origin uidata.UI, robotID string, weaponID string) (uidata.UI, bool, error) {
	var err error
	ctx := origin
	if err != nil {
		return origin, false, err
	}
	// 選擇敵機時將選單關掉
	// 先不使用
	// ctx.Model, err = ctx.Model.DisableRobotMenu()
	// if err != nil {
	// 	return origin, false, err
	// }
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	weapon, err := protocol.TryGetStringWeapon(gameplayPage.RobotMenu.Weapons, weaponID)
	if err != nil {
		return origin, false, err
	}
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return origin, false, err
	}
	switch weaponProto.Type {
	case "single":
		for {
			var cancel bool
			var targetID string
			ctx, targetID, cancel, err = common.SelectUnitStep(ctx, robotID, func(targetID string) error {
				robot, err := protocol.TryGetStringRobot(gameplayPage.Robots, robotID)
				if err != nil {
					return err
				}
				targetRobot, err := protocol.TryGetStringRobot(gameplayPage.Robots, targetID)
				if err != nil {
					return err
				}
				plyr1, err := protocol.TryGetStringPlayer(gameplayPage.Players, robot.PlayerID)
				if err != nil {
					return err
				}
				plyr2, err := protocol.TryGetStringPlayer(gameplayPage.Players, targetRobot.PlayerID)
				if err != nil {
					return err
				}
				if plyr1.GroupID == plyr2.GroupID {
					return fmt.Errorf("必須選擇敵人")
				}
				return nil
			})
			if err != nil {
				return origin, false, err
			}
			if cancel {
				return origin, cancel, nil
			}
			ctxObj, cancel, err := ctx.Model.OnSingleBattleMenuPhase(ctx, true, robotID, weaponID, targetID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				continue
			}
			ctx = ctxObj.(uidata.UI)
			ctxObj, err = ctx.Model.OnRobotDone(ctx, robotID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
			break
		}
	case "line":
		for {
			var cancel bool
			var cursor protocol.Position
			ctx, cursor, cancel, err = common.SelectPositionStep(ctx, robotID, func(ctx uidata.UI, localCursor protocol.Position) error {
				return nil
			})
			if err != nil {
				return origin, false, err
			}
			if cancel {
				return origin, cancel, nil
			}
			cursorWorld := helper.Local2World(ctx.GameplayPages[uidata.PageGameplay].Camera, cursor)
			ctxObj, cancel, err := ctx.Model.OnLineBattleMenuPhase(ctx, true, robotID, weaponID, cursorWorld)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				continue
			}
			ctx = ctxObj.(uidata.UI)
			ctxObj, err = ctx.Model.OnRobotDone(ctx, robotID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
			break
		}
	default:
		return origin, false, fmt.Errorf("unknown weapon type(%v)", weaponProto)
	}
	return ctx, false, nil
}
