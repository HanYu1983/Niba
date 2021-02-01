package common

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func BattleMenuPhase(origin uidata.UI, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "BattleMenuPhase", "start")
	view := def.View
	model := def.Model
	model.Push()
	defer model.Pop()
	var err error
	ctx := origin
	err = model.EnableBattleMenu(robotID, weaponID, targetRobotID)
	if err != nil {
		model.Reset()
		return origin, false, err
	}

	if isPlayerTurn {
		// 先準備UI
		ctx, err = ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		// 再更新UnitMenu的Cursor
		// @TODO: update selection index for focus weapon
		// unitMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		view.Render(ctx)
		var cancel, tab bool
		var selection string
		for {
			ctx, err = ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				model.Reset()
				return origin, cancel, nil
			}
			break
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			targetRobotAction := protocol.BattleMenuActionAttack
			result, err := model.Battle(robotID, weaponID, targetRobotID, targetRobotAction, "")
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			view.RenderRobotBattle(ctx, result)
			return ctx, true, nil
		default:
			return origin, false, fmt.Errorf("玩家回合時必須只有武器選項")
		}
	} else {
		var cancel, tab bool
		var selection string
		for {
			ctx, err = ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
				model.Reset()
				return origin, false, err
			}
			if tab {
				continue
			}
			if cancel {
				log.Log(protocol.LogCategoryInfo, "BattleMenuPhase", "敵人回合不能取消")
				continue
			}
			break
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
		var playerAction int
		var playerWeaponID string
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			playerWeaponID = selection
			playerAction = protocol.BattleMenuActionAttack
		default:
			switch selection {
			case uidata.MenuOptionUnitGuard:
				playerAction = protocol.BattleMenuActionGuard
			case uidata.MenuOptionUnitEvade:
				playerAction = protocol.BattleMenuActionEvade
			default:
				return origin, false, fmt.Errorf("未知的選項(%v)", selection)
			}
		}
		targetRobotAction := playerAction
		targetRobotWeaponID := playerWeaponID
		result, err := model.Battle(robotID, weaponID, targetRobotID, targetRobotAction, targetRobotWeaponID)
		if err != nil {
			model.Reset()
			return origin, false, err
		}
		view.RenderRobotBattle(ctx, result)
		return ctx, true, nil
	}
	model.DisableBattleMenu()
	log.Log(protocol.LogCategoryPhase, "BattleMenuPhase", "end")
	return ctx, false, nil
}
