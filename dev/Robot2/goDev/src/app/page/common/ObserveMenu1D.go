package common

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
)

func ObserveMenu1D(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	model := def.Model
	menu, has := ctx.Menu1Ds[menuID]
	if has == false {
		return origin, nil
	}
	options := []string{}
	switch menuID {
	case uidata.Menu1DPilotListMenu:
		options = protocol.KesStringPilot(model.QueryPilots())
	case uidata.Menu1DRobotPilotListMenu, uidata.Menu1DRobotListMenu, uidata.Menu1DMultiUnitSelectionMenu:
		options = protocol.KesStringRobot(model.QueryRobots())
	case uidata.Menu1DWeaponRobotListMenu, uidata.Menu1DWeaponListMenu:
		options = protocol.KesStringWeapon(model.QueryWeapons())
	case uidata.Menu1DComponentRobotListMenu, uidata.Menu1DComponentListMenu:
		options = protocol.KesStringComponent(model.QueryComponents())
	case uidata.Menu1DBuyRobotMenu:
		canBuy := model.QueryRobotCanBuy()
		options = data.KesStringRobotProto(canBuy)
	case uidata.Menu1DBuyPilotMenu:
		canBuy := model.QueryPilotCanBuy()
		options = data.KesStringPilotProto(canBuy)
	case uidata.Menu1DBuyWeaponMenu:
		canBuy := model.QueryWeaponCanBuy()
		options = data.KesStringWeaponProto(canBuy)
	case uidata.Menu1DBuyComponentMenu:
		canBuy := model.QueryComponentCanBuy()
		options = data.KesStringComponentProto(canBuy)
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
