package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func CreateRobotMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	var err error
	ctx := origin
	ctx.Model, err = ctx.Model.EnableRobotMenu(unitID, nil)
	if err != nil {
		return origin, err
	}
	return ctx, nil
}

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v) start", unitID))
	view := def.View
	var err error
	ctx := origin
	ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, false, err
	}
	view.Render(ctx)
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	if robot, is := gameplayPage.Robots[unitID]; is {
		var _ = robot
		isRobotDone := ctx.GameplayPages[uidata.PageGameplay].Tags[unitID].IsDone
		if isRobotDone {
			log.Log(protocol.LogCategoryWarning, "UnitMenuPhase", fmt.Sprintf("unitID(%v) already done", unitID))
			return origin, false, nil
		}
		ctx, err = CreateRobotMenu(ctx, unitID)
		if err != nil {
			return origin, false, err
		}
		var cancel, tab bool
		var selection string
	MENU2D_STEP:
		for {
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
			if ctx.Actives[uidata.PageUnitMenu] == false {
				return origin, false, fmt.Errorf("這時必須打開PageUnitMenu頁")
			}
			ctx, selection, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				return origin, cancel, nil
			}
			break
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage = ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			if invalidStr, has := gameplayPage.RobotMenu.InvalidWeapons[weaponID]; has {
				view.Alert(invalidStr)
				goto MENU2D_STEP
			}
		SELECT_UNIT_STEP:
			var targetID string
			ctx, targetID, cancel, err = SelectUnitStep(ctx, unitID, func(targetID string) error {
				robot, err := protocol.TryGetStringRobot(gameplayPage.Robots, unitID)
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
				goto MENU2D_STEP
			}
			ctx, cancel, err = common.BattleMenuPhase(ctx, true, unitID, weaponID, targetID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				goto SELECT_UNIT_STEP
			}
		case protocol.RobotMenuFunctionTransform:
			transformID := selection
			ctxObj, err := ctx.Model.OnRobotTransform(ctx, unitID, transformID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
			ctx, cancel, err = UnitMenuPhase(ctx, unitID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				return origin, cancel, nil
			}
		default:
			switch selection {
			case uidata.MenuOptionUnitDone:
				ctxObj, err := ctx.Model.OnRobotDone(ctx, unitID)
				if err != nil {
					return origin, false, err
				}
				ctx = ctxObj.(uidata.UI)
			case uidata.MenuOptionMove:
				ctx, cancel, err = RobotMovePhase(ctx, unitID)
				if err != nil {
					return origin, false, err
				}
				if cancel {
					goto MENU2D_STEP
				}
			case uidata.MenuOptionSkyGround:
				tag := gameplayPage.Tags[unitID]
				ctxObj, err := ctx.Model.OnRobotSkyGround(ctx, unitID, !tag.Sky)
				if err != nil {
					return origin, false, err
				}
				ctx = ctxObj.(uidata.UI)
				// 更新移動範圍
				ctx, err = HandleShowMoveRangeWhenUnitAtCursor(ctx, struct{}{})
				if err != nil {
					return origin, false, err
				}
				ctx, cancel, err = UnitMenuPhase(ctx, unitID)
				if err != nil {
					return origin, false, err
				}
				if cancel {
					goto MENU2D_STEP
				}
			case uidata.MenuOptionConfirm:
				// do nothing
			}
		}
		ctx.Model, err = ctx.Model.DisableRobotMenu()
		if err != nil {
			return origin, false, err
		}
	}
	if item, is := gameplayPage.Items[unitID]; is {
		var _ = item
		// append menu
		ctx, err := CreateItemMenu(ctx, unitID)
		if err != nil {
			return origin, false, err
		}
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, true)
		var cancel, tab bool
		var selection string
		for {
			ctx, selection, cancel, tab, err = common.Menu1DStep(ctx, uidata.PageGameplay, uidata.Menu1DSystemMenu)
			if err != nil {
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				return origin, cancel, nil
			}
			break
		}
		var _ = selection
		ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageSystemMenu, false)
	}
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v) end", unitID))
	return ctx, false, nil
}
