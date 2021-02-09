package v1

import (
	"app/tool"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func ObserveBattleMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	model := ctx.Model.(model)
	menu, has := ctx.BattleMenus[menuID]
	if has == false {
		return origin, nil
	}
	switch menuID {
	case uidata.BattleMenuUnitBattleMenu:
		unitMenuModel := GetRobotMenu(model)
		battleMenuModel := GetBattleMenu(model)
		if battleMenuModel.Active {
			robot, pilot, weapon := battleMenuModel.AttackRobot, battleMenuModel.AttackPilot, battleMenuModel.AttackWeapon
			targetRobot, targetPilot := battleMenuModel.DeffenceRobot, battleMenuModel.DeffencePilot
			// 攻擊方命中率
			hitRate, err := QueryBattleHitRate(model, robot, pilot, weapon, targetRobot, targetPilot)
			if err != nil {
				return origin, err
			}
			// 攻擊方設置在左面板
			menu.Left.Robot = robot
			menu.Left.Pilot = pilot
			menu.Left.BattleAction = protocol.BattleMenuActionAttack
			menu.Left.Info.HitRate = hitRate
			// 防守方設置在右面板
			menu.Right.Robot = targetRobot
			menu.Right.Pilot = targetPilot
			menu.Right.BattleAction = protocol.BattleMenuActionPending
			// 判斷武器切換
			unitMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
			isSelectingWeapon := unitMenuModel.RowFunctionMapping[unitMenu.Cursor1] == protocol.RobotMenuFunctionWeapon
			selection, err := tool.TryGetString2(unitMenu.Options, unitMenu.Cursor1)(tool.TryGetInt(unitMenu.Cursor2, unitMenu.Cursor1))
			if err != nil {
				return origin, err
			}
			switch {
			case battleMenuModel.AttackRobot.PlayerID == protocol.PlayerIDPlayer:
				// 若是好人攻擊
				switch {
				case isSelectingWeapon:
					selectedWeapon := unitMenuModel.Weapons[selection]
					// 重設武器
					menu.Left.Weapon = selectedWeapon
					// 重算命中率
					hitRate, err := QueryBattleHitRate(model, robot, pilot, selectedWeapon, targetRobot, targetPilot)
					if err != nil {
						return origin, err
					}
					menu.Left.Info.HitRate = hitRate
					// 重算敵人反應
					targetAction, targetWeapon, err := QueryBattleAction(model, robot, pilot, selectedWeapon, targetRobot, targetPilot)
					if err != nil {
						return origin, err
					}
					// 若敵方反擊
					if targetAction == protocol.BattleMenuActionAttack {
						// 重設武器
						menu.Right.Weapon = targetWeapon
						// 重算命中率
						hitRate, err = QueryBattleHitRate(model, targetRobot, targetPilot, targetWeapon, robot, pilot)
						if err != nil {
							return origin, err
						}
						menu.Right.Info.HitRate = hitRate
					}
					// 重設敵方動作
					menu.Right.BattleAction = targetAction
				}
			case battleMenuModel.DeffenceRobot.PlayerID == protocol.PlayerIDPlayer:
				// 若是敵人攻擊
				switch {
				case isSelectingWeapon:
					selectedWeapon := unitMenuModel.Weapons[selection]
					// 重設武器
					menu.Right.Weapon = selectedWeapon
					menu.Right.BattleAction = protocol.BattleMenuActionAttack
					// 重算命中率
					hitRate, err := QueryBattleHitRate(model, targetRobot, targetPilot, selectedWeapon, robot, pilot)
					if err != nil {
						return origin, err
					}
					menu.Right.Info.HitRate = hitRate
				case selection == uidata.MenuOptionUnitGuard:
					// 重設我方動作
					menu.Right.BattleAction = protocol.BattleMenuActionGuard
				case selection == uidata.MenuOptionUnitEvade:
					// 重設我方動作
					menu.Right.BattleAction = protocol.BattleMenuActionEvade
				default:
					return origin, fmt.Errorf("unknown action. unitMenu(%+v)", unitMenu)
				}
			default:
				return origin, fmt.Errorf("unknown situation.")
			}
			// 戰鬥雙方都必須選擇一個動作
			if menu.Left.BattleAction == protocol.BattleMenuActionPending {
				return origin, fmt.Errorf("menu.Left.BattleAction must set.(%+v)", menu.Left)
			}
			if menu.Right.BattleAction == protocol.BattleMenuActionPending {
				return origin, fmt.Errorf("menu.Right.BattleAction must set.(%+v)", menu.Right)
			}
		}
	}
	ctx.BattleMenus = uidata.AssocIntBattleMenu(ctx.BattleMenus, menuID, menu)
	return ctx, nil
}
