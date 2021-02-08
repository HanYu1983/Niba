package common

import (
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func AutoCursorAtWeaponID(origin uidata.UI, menu2DID int, weaponID string) (uidata.UI, error) {
	ctx := origin
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	unitMenu := ctx.Menu2Ds[menu2DID]
	weaponFunctionIdx := -1
	weaponIdx := -1
	for i, function := range gameplayPage.RobotMenu.RowFunctionMapping {
		if function == protocol.RobotMenuFunctionWeapon {
			if i >= len(unitMenu.Options) {
				return origin, fmt.Errorf("[BattleMenuPhase] function idx(%v) more then Options", i)
			}
			weaponFunctionIdx = i
			weaponIdx = tool.FindStringIndex(unitMenu.Options[i], weaponID)
		}
	}
	if weaponFunctionIdx == -1 {
		return origin, fmt.Errorf("[BattleMenuPhase] weaponFunctionIdx(%v) not found.", weaponFunctionIdx)
	}
	if weaponIdx == -1 {
		return origin, fmt.Errorf("[BattleMenuPhase] weaponID(%v) not found in Options(%v).", weaponID, unitMenu.Options)
	}
	unitMenu.Cursor1 = weaponFunctionIdx
	unitMenu.Cursor2[unitMenu.Cursor1] = weaponIdx
	ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, menu2DID, unitMenu)
	return ctx, nil
}

func BattleMenuPhase(origin uidata.UI, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "BattleMenuPhase", "start")
	var err error
	ctx := origin
	view := def.View
	ctx.Model, err = ctx.Model.EnableBattleMenu(robotID, weaponID, targetRobotID)
	if err != nil {
		return origin, false, err
	}
	if isPlayerTurn {
		// 先準備UI
		ctx, err = ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			return origin, false, err
		}
		// 再更新Menu的Cursor
		ctx, err = AutoCursorAtWeaponID(ctx, uidata.Menu2DUnitMenu, weaponID)
		if err != nil {
			return origin, false, err
		}
		view.Render(ctx)
		var cancel, tab bool
		var selection string
		for {
			ctx, err = ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
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
		ctx, err = ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			return origin, false, err
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			battleMenus, hasBattleMenu := ctx.BattleMenus[uidata.BattleMenuUnitBattleMenu]
			if hasBattleMenu == false {
				return origin, false, fmt.Errorf("戰鬥階段時uidata.BattleMenuUnitBattleMenu必須存在")
			}
			targetRobotAction := battleMenus.Right.BattleAction
			targetRobotWeapon := battleMenus.Right.Weapon
			var result protocol.BattleResult
			ctx.Model, result, err = ctx.Model.Battle(robotID, weaponID, targetRobotID, targetRobotAction, targetRobotWeapon.ID)
			if err != nil {
				return origin, false, err
			}
			// 關掉battleMenuh後再畫戰鬥動畫
			ctx.Model, err = ctx.Model.DisableBattleMenu()
			if err != nil {
				return origin, false, err
			}
			ctx, err = ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
			view.RenderRobotBattle(ctx, result)
		default:
			return origin, false, fmt.Errorf("玩家回合時必須只有武器選項")
		}
	} else {
		var cancel, tab bool
		var selection string
		for {
			ctx, err = ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
			ctx, selection, cancel, tab, err = Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
			if err != nil {
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
		var result protocol.BattleResult
		ctx.Model, result, err = ctx.Model.Battle(robotID, weaponID, targetRobotID, targetRobotAction, targetRobotWeaponID)
		if err != nil {
			return origin, false, err
		}
		// 關掉battleMenuh後再畫戰鬥動畫
		ctx.Model, err = ctx.Model.DisableBattleMenu()
		if err != nil {
			return origin, false, err
		}
		ctx, err = ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			return origin, false, err
		}
		view.Render(ctx)
		view.RenderRobotBattle(ctx, result)
	}
	ctx.Model, err = ctx.Model.DisableBattleMenu()
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryPhase, "BattleMenuPhase", "end")
	return ctx, false, nil
}
