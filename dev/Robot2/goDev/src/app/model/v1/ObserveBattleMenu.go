package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func ObserveBattleMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	log.Log(protocol.LogCategoryRender, "ObserveBattleMenu", "start")
	ctx := origin
	log.Log(protocol.LogCategoryRender, "ObserveBattleMenu", fmt.Sprintf("ctx.Actives[uidata.PageGameplay](%v)", ctx.Actives[uidata.PageGameplay]))
	if ctx.Actives[uidata.PageGameplay] == false {
		return origin, nil
	}
	model := types.Model(ctx.Model.(Model))
	menu, has := ctx.BattleMenus[menuID]
	if has == false {
		return origin, nil
	}
	switch menuID {
	case uidata.BattleMenuUnitBattleMenu:
		unitMenuModel := impl.GetRobotMenu(model)
		battleMenuModel := impl.GetBattleMenu(model)
		log.Log(protocol.LogCategoryRender, "ObserveBattleMenu", fmt.Sprintf("battleMenuModel(%+v)", battleMenuModel))
		if battleMenuModel.Active {
			robot, pilot, weapon := battleMenuModel.AttackRobot, battleMenuModel.AttackPilot, battleMenuModel.AttackWeapon
			targetRobot, targetPilot := battleMenuModel.DeffenceRobot, battleMenuModel.DeffencePilot
			if robot.ID == "" {
				return origin, fmt.Errorf("你忘了在OnEnableBattleMenu中設定AttackRobot")
			}
			if pilot.ID == "" {
				return origin, fmt.Errorf("你忘了在OnEnableBattleMenu中設定AttackPilot")
			}
			if targetRobot.ID == "" {
				return origin, fmt.Errorf("你忘了在OnEnableBattleMenu中設定DeffenceRobot")
			}
			if targetPilot.ID == "" {
				return origin, fmt.Errorf("你忘了在OnEnableBattleMenu中設定DeffencePilot")
			}
			// 攻擊方命中率
			hitRate, err := impl.QueryBattleHitRate(model, robot, pilot, weapon, targetRobot, targetPilot, impl.QueryBattleHitRateOptions{})
			if err != nil {
				return origin, err
			}
			// 攻擊方設置在左面板
			menu.Left.Robot, err = common.ObserveRobot(model, robot, true)
			if err != nil {
				return origin, err
			}
			menu.Left.Pilot = pilot
			menu.Left.BattleAction = protocol.BattleMenuActionAttack
			menu.Left.Weapon, err = common.ObserveWeapon(model, robot.ID, weapon, true)
			if err != nil {
				return origin, err
			}
			menu.Left.Info.HitRate = hitRate
			// 防守方設置在右面板
			menu.Right.Robot, err = common.ObserveRobot(model, targetRobot, true)
			if err != nil {
				return origin, err
			}
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
					hitRate, err := impl.QueryBattleHitRate(model, robot, pilot, selectedWeapon, targetRobot, targetPilot, impl.QueryBattleHitRateOptions{})
					if err != nil {
						return origin, err
					}
					menu.Left.Info.HitRate = hitRate
					// 重算敵人反應
					targetAction, targetWeapon, err := impl.QueryBattleAction(model, robot, pilot, selectedWeapon, targetRobot, targetPilot)
					if err != nil {
						return origin, err
					}
					if targetAction == protocol.BattleMenuActionPending {
						return origin, fmt.Errorf("QueryBattleAction不能回傳pending")
					}
					// 若敵方反擊
					if targetAction == protocol.BattleMenuActionAttack {
						// 重設武器
						menu.Right.Weapon, err = common.ObserveWeapon(model, targetRobot.ID, targetWeapon, true)
						if err != nil {
							return origin, err
						}
						// 重算命中率
						hitRate, err = impl.QueryBattleHitRate(model, targetRobot, targetPilot, targetWeapon, robot, pilot, impl.QueryBattleHitRateOptions{})
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
					hitRate, err := impl.QueryBattleHitRate(model, targetRobot, targetPilot, selectedWeapon, robot, pilot, impl.QueryBattleHitRateOptions{})
					if err != nil {
						return origin, err
					}
					menu.Right.Info.HitRate = hitRate
				case selection == uidata.MenuOptionUnitGuard:
					// 重設我方動作
					menu.Right.Weapon = protocol.Weapon{}
					menu.Right.BattleAction = protocol.BattleMenuActionGuard
				case selection == uidata.MenuOptionUnitEvade:
					// 重設我方動作
					menu.Right.Weapon = protocol.Weapon{}
					menu.Right.BattleAction = protocol.BattleMenuActionEvade
					// 對方命中率除2
					menu.Left.Info.HitRate = hitRate / 2
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
				return origin, fmt.Errorf("menu.Right.BattleAction must set.(%+v). 這個情況也許發生在攻擊自機的時候(理論上不能)", menu.Right)
			}
		}
	}
	ctx.BattleMenus = uidata.AssocIntBattleMenu(ctx.BattleMenus, menuID, menu)
	log.Log(protocol.LogCategoryRender, "ObserveBattleMenu", "end")
	return ctx, nil
}
