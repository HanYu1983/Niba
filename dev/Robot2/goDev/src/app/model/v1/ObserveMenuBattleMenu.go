package v1

import (
	"app/tool"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func (model *model) ObserveBattleMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	menu, has := ctx.BattleMenus[menuID]
	if has == false {
		return origin, nil
	}
	switch menuID {
	case uidata.BattleMenuUnitBattleMenu:
		unitMenuModel := model.GetRobotMenu()
		battleMenuModel := model.GetBattleMenu()
		if battleMenuModel.Active {
			menu.Left.Robot = battleMenuModel.AttackRobot
			menu.Left.Weapon = battleMenuModel.AttackWeapon
			menu.Left.BattleAction = protocol.BattleMenuActionAttack
			menu.Right.Robot = battleMenuModel.DeffenceRobot
			menu.Right.BattleAction = protocol.BattleMenuActionPending

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
				menu.Right.Weapon = selectedWeapon
				menu.Right.BattleAction = protocol.BattleMenuActionAttack
				menu.Left.Info.HitRate = 0.5
			case selection == uidata.MenuOptionUnitGuard:
				menu.Right.BattleAction = protocol.BattleMenuActionGuard
			case selection == uidata.MenuOptionUnitEvade:
				menu.Right.BattleAction = protocol.BattleMenuActionEvade
			default:
				return origin, fmt.Errorf("unknown action. unitMenu(%+v)", unitMenu)
			}
		}
	}
	ctx.BattleMenus = uidata.AssocIntBattleMenu(ctx.BattleMenus, menuID, menu)
	return ctx, nil
}
