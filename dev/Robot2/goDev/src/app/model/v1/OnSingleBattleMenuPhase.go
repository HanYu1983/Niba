package v1

import (
	"app/page/common"
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

func OnSingleBattleMenuPhase(origin uidata.UI, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "OnSingleBattleMenuPhase", "start")
	var err error
	ctx := origin
	view := def.View
	ctx, err = OnEnableBattleMenu(ctx, robotID, weaponID, targetRobotID)
	if err != nil {
		return origin, false, err
	}
	if isPlayerTurn {
		// 先準備UI
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		// 再更新Menu的Cursor
		ctx, err = AutoCursorAtWeaponID(ctx, uidata.Menu2DUnitMenu, weaponID)
		if err != nil {
			return origin, false, err
		}
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
	PLAYER_MENU2D_STEP:
		var cancel, tab bool
		var selection string
		for {
			ctx, err = view.Render(ctx)
			if err != nil {
				return origin, false, err
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
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		topMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
		switch gameplayPage.RobotMenu.RowFunctionMapping[topMenu.Cursor1] {
		case protocol.RobotMenuFunctionWeapon:
			weaponID := selection
			if invalidStr, has := gameplayPage.RobotMenu.InvalidWeapons[weaponID]; has {
				view.Alert(invalidStr)
				goto PLAYER_MENU2D_STEP
			}
			battleMenus, hasBattleMenu := ctx.BattleMenus[uidata.BattleMenuUnitBattleMenu]
			if hasBattleMenu == false {
				return origin, false, fmt.Errorf("戰鬥階段時uidata.BattleMenuUnitBattleMenu必須存在")
			}
			targetRobotAction := battleMenus.Right.BattleAction
			targetRobotWeapon := battleMenus.Right.Weapon
			ctx, err = OnRobotBattle(ctx, robotID, weaponID, targetRobotID, targetRobotAction, targetRobotWeapon.ID)
			if err != nil {
				return origin, false, err
			}
		default:
			return origin, false, fmt.Errorf("玩家回合時必須只有武器選項")
		}
	} else {
	ENEMY_MENU2D_STEP:
		var cancel, tab bool
		var selection string
		for {
			ctx, err = view.Render(ctx)
			if err != nil {
				return origin, false, err
			}
			ctx, selection, cancel, tab, err = common.Menu2DStep(ctx, uidata.PageGameplay, uidata.Menu2DUnitMenu)
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
		if invalidStr, has := gameplayPage.RobotMenu.InvalidWeapons[playerWeaponID]; has {
			view.Alert(invalidStr)
			goto ENEMY_MENU2D_STEP
		}
		targetRobotAction := playerAction
		targetRobotWeaponID := playerWeaponID
		ctx, err = OnRobotBattle(ctx, robotID, weaponID, targetRobotID, targetRobotAction, targetRobotWeaponID)
		if err != nil {
			return origin, false, err
		}
	}
	ctx, err = OnDisableBattleMenu(ctx)
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryPhase, "OnSingleBattleMenuPhase", "end")
	return ctx, false, nil
}
