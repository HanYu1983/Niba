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
		canBuy, err := model.QueryRobotCanBuy()
		if err != nil {
			return origin, err
		}
		options = data.KesStringRobotProto(canBuy)
	case uidata.Menu1DBuyPilotMenu:
		canBuy, err := model.QueryPilotCanBuy()
		if err != nil {
			return origin, err
		}
		options = data.KesStringPilotProto(canBuy)
	case uidata.Menu1DBuyWeaponMenu:
		canBuy, err := model.QueryWeaponCanBuy()
		if err != nil {
			return origin, err
		}
		options = data.KesStringWeaponProto(canBuy)
	case uidata.Menu1DBuyComponentMenu:
		canBuy, err := model.QueryComponentCanBuy()
		if err != nil {
			return origin, err
		}
		options = data.KesStringComponentProto(canBuy)
	default:
		fmt.Printf("ObserveMenu not found %v. ignore.\n", menuID)
		return ctx, nil
	}
	left, right := tool.Max(0, menu.Offset), tool.Min(menu.Offset+menu.Limit, len(options))
	menu.Options = options[left:right]
	menu.Cursor = tool.Max(tool.Min(menu.Cursor, len(menu.Options)-1), 0)
	ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	return ctx, nil
}
