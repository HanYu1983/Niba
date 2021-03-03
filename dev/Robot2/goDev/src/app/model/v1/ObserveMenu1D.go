package v1

import (
	"app/model/v1/internal/lobby"
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

func ObserveMenu1D(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	model := types.Model(ctx.Model.(Model))
	menu, has := ctx.Menu1Ds[menuID]
	if has == false {
		return origin, nil
	}
	options := []string{}
	switch menuID {
	case uidata.Menu1DPilotListMenu:
		options = protocol.KesStringPilot(model.App.Lobby.Pilots)
	case uidata.Menu1DRobotPilotListMenu, uidata.Menu1DRobotListMenu, uidata.Menu1DMultiUnitSelectionMenu:
		options = protocol.KesStringRobot(model.App.Lobby.Robots)
	case uidata.Menu1DWeaponRobotListMenu, uidata.Menu1DWeaponListMenu:
		options = protocol.KesStringWeapon(model.App.Lobby.Weapons)
	case uidata.Menu1DComponentRobotListMenu, uidata.Menu1DComponentListMenu:
		options = protocol.KesStringComponent(model.App.Lobby.Components)
	case uidata.Menu1DBuyRobotMenu:
		canBuy := lobby.QueryRobotCanBuy(model)
		options = data.KesStringRobotProto(canBuy)
	case uidata.Menu1DBuyPilotMenu:
		canBuy := lobby.QueryPilotCanBuy(model)
		options = data.KesStringPilotProto(canBuy)
	case uidata.Menu1DBuyWeaponMenu:
		canBuy := lobby.QueryWeaponCanBuy(model)
		options = data.KesStringWeaponProto(canBuy)
	case uidata.Menu1DBuyComponentMenu:
		canBuy := lobby.QueryComponentCanBuy(model)
		options = data.KesStringComponentProto(canBuy)
	case uidata.Menu1DSystemMenu:
		options = []string{uidata.MenuOptionTurnDone, uidata.MenuOptionSave, uidata.MenuOptionLoad, uidata.MenuOptionGiveUp, uidata.MenuOptionTest, uidata.MenuOptionTest2, uidata.MenuOptionTest3}
	}
	if menu.Limit == 0 {
		return origin, fmt.Errorf("menuID(%v) Menu1D(%+v)的Limit不能為0", menuID, menu)
	}
	menu.Offset = helper.Max(0, helper.Min((len(options)/menu.Limit)*menu.Limit, menu.Offset))
	left, right := helper.Max(0, helper.Min(menu.Offset, len(options)-1)), helper.Min(menu.Offset+menu.Limit, len(options))
	if len(options) > 0 {
		menu.Options = options[left:right]
	}
	menu.Cursor = helper.Max(0, helper.Min(len(menu.Options)-1, menu.Cursor))
	ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	return ctx, nil
}
