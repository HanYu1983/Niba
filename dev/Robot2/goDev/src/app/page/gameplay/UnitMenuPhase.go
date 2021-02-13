package gameplay

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func CreateItemMenu(origin uidata.UI, unitID string) (uidata.UI, error) {
	return origin, nil
}

func UnitMenuPhase(origin uidata.UI, unitID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "UnitMenuPhase", fmt.Sprintf("unitID(%v) start", unitID))
	var err error
	ctx := origin
	view := def.View
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, false, err
	}
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	if robot, is := gameplayPage.Robots[unitID]; is {
		var _ = robot
		isRobotDone := ctx.GameplayPages[uidata.PageGameplay].Tags[unitID].IsDone
		if isRobotDone {
			log.Log(protocol.LogCategoryWarning, "UnitMenuPhase", fmt.Sprintf("unitID(%v) already done", unitID))
			return origin, false, nil
		}
		ctxObj, err := ctx.Model.OnEnableRobotMenu(ctx, unitID)
		if err != nil {
			return origin, false, err
		}
		ctx = ctxObj.(uidata.UI)
		var cancel, tab bool
		var selection string
	MENU2D_STEP:
		for {
			ctx, err = view.Render(ctx)
			if err != nil {
				return origin, false, err
			}
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
			ctx, cancel, err = SelectWeaponTargetPhase(ctx, unitID, weaponID)
			if err != nil {
				return origin, false, err
			}
			if cancel {
				goto MENU2D_STEP
			}
		case protocol.RobotMenuFunctionTransform:
			transformID := selection
			ctxObj, err := ctx.Model.OnRobotTransform(ctx, unitID, transformID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
			// 更新移動範圍
			ctx, err = common.HandleShowMoveRangeWhenUnitAtCursor(ctx, struct{}{})
			if err != nil {
				return origin, false, err
			}
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
				ctx, err = common.HandleShowMoveRangeWhenUnitAtCursor(ctx, struct{}{})
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
		ctxObj, err = ctx.Model.OnDisableRobotMenu(ctx)
		if err != nil {
			return origin, false, err
		}
		ctx = ctxObj.(uidata.UI)
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
