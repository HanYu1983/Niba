package common

import (
	"app/tool"
	"app/tool/data"
	"app/tool/uidata"
	"fmt"
)

func ObserveMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	menu := ctx.Menu1Ds[menuID]
	options := []string{}
	switch menuID {
	case uidata.Menu1DPilotListMenu:
		options = data.KesStringPilot(model.QueryPilots())
	case uidata.Menu1DRobotPilotListMenu, uidata.Menu1DRobotListMenu, uidata.Menu1DMultiUnitSelectionMenu:
		options = data.KesStringRobot(model.QueryRobots())
	case uidata.Menu1DWeaponRobotListMenu, uidata.Menu1DWeaponListMenu:
		options = data.KesStringWeapon(model.QueryWeapons())
	case uidata.Menu1DComponentRobotListMenu, uidata.Menu1DComponentListMenu:
		options = data.KesStringComponent(model.QueryComponents())
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
	default:
		fmt.Printf("ObserveMenu not found %v. ignore.\n", menuID)
		return ctx, nil
	}
	menu.Offset = tool.Max(0, tool.Min((len(options)/menu.Limit)*menu.Limit, menu.Offset))
	left, right := tool.Max(0, tool.Min(menu.Offset, len(options)-1)), tool.Min(menu.Offset+menu.Limit, len(options))
	fmt.Printf("len(%v) %v~%v\n", len(options), left, right)
	if len(options) > 0 {
		menu.Options = options[left:right]
	}
	menu.Cursor = tool.Max(0, tool.Min(len(menu.Options)-1, menu.Cursor))
	ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	return ctx, nil
}
