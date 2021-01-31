package common

import (
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func ObserveBattleMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	model := def.Model
	menu, has := ctx.BattleMenus[menuID]
	if has == false {
		return origin, nil
	}
	switch menuID {
	case uidata.BattleMenuUnitBattleMenu:
		unitMenuModel := model.GetRobotMenu()
		battleMenuModel := model.GetBattleMenu()
		if battleMenuModel.Active {
			battleMenu := ctx.BattleMenus[uidata.BattleMenuUnitBattleMenu]
			battleMenu.Left.Robot = battleMenuModel.AttackRobot
			battleMenu.Left.Weapon = battleMenuModel.AttackWeapon
			battleMenu.Left.BattleAction = protocol.BattleMenuActionAttack

			battleMenu.Right.Robot = battleMenuModel.DeffenceRobot
			battleMenu.Right.BattleAction = protocol.BattleMenuActionPending

			unitMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
			isSelectingWeapon := unitMenuModel.RowFunctionMapping[unitMenu.Cursor1] == protocol.RobotMenuFunctionWeapon
			selection, err := tool.TryGetString2(unitMenu.Options, unitMenu.Cursor1)(tool.TryGetInt(unitMenu.Cursor2, unitMenu.Cursor1))
			if err != nil {
				return origin, err
			}
			switch {
			case isSelectingWeapon:
				selectedWeaponID := selection
				selectedWeapon := unitMenuModel.Weapons[selectedWeaponID]
				battleMenu.Right.Weapon = selectedWeapon
				battleMenu.Right.BattleAction = protocol.BattleMenuActionAttack
			case selection == uidata.MenuOptionUnitGuard:
				battleMenu.Right.BattleAction = protocol.BattleMenuActionGuard
			case selection == uidata.MenuOptionUnitEvade:
				battleMenu.Right.BattleAction = protocol.BattleMenuActionEvade
			default:
				return origin, fmt.Errorf("未知的行為")
			}
			ctx.BattleMenus = uidata.AssocIntBattleMenu(ctx.BattleMenus, uidata.PageBattleMenu, battleMenu)
		}
	}
	ctx.BattleMenus = uidata.AssocIntBattleMenu(ctx.BattleMenus, menuID, menu)
	return ctx, nil
}
