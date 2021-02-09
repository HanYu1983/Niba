package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
)

func ObserveMenu1D(origin uidata.UI, menuID string) (uidata.UI, error) {
	ctx := origin
	model := ctx.Model.(model)
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
		canBuy := QueryRobotCanBuy(model)
		options = data.KesStringRobotProto(canBuy)
	case uidata.Menu1DBuyPilotMenu:
		canBuy := QueryPilotCanBuy(model)
		options = data.KesStringPilotProto(canBuy)
	case uidata.Menu1DBuyWeaponMenu:
		canBuy := QueryWeaponCanBuy(model)
		options = data.KesStringWeaponProto(canBuy)
	case uidata.Menu1DBuyComponentMenu:
		canBuy := QueryComponentCanBuy(model)
		options = data.KesStringComponentProto(canBuy)
	case uidata.Menu1DSystemMenu:
		options = []string{uidata.MenuOptionTurnDone}
	}
	menu.Offset = helper.Max(0, helper.Min((len(options)/menu.Limit)*menu.Limit, menu.Offset))
	left, right := helper.Max(0, helper.Min(menu.Offset, len(options)-1)), helper.Min(menu.Offset+menu.Limit, len(options))
	if len(options) > 0 {
		menu.Options = options[left:right]
	}
	menu.Cursor = helper.Max(0, helper.Min(len(menu.Options)-1, menu.Cursor))
	ctx.Menu1Ds = uidata.AssocStringMenu1D(ctx.Menu1Ds, menuID, menu)
	return ctx, nil
}
