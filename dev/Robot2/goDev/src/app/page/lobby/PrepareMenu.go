package lobby

import (
	"app/tool/data"
	"app/tool/uidata"
	"fmt"
)

func PrepareMenu(origin uidata.UI, menuID int) (uidata.UI, error) {
	ctx := origin
	switch menuID {
	case uidata.Menu1DPilotListMenu:
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringPilot(model.QueryPilots())
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DRobotPilotListMenu, uidata.Menu1DRobotListMenu, uidata.Menu1DMultiUnitSelectionMenu:
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringRobot(model.QueryRobots())
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DWeaponRobotListMenu, uidata.Menu1DWeaponListMenu:
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringWeapon(model.QueryWeapons())
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DComponentRobotListMenu, uidata.Menu1DComponentListMenu:
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringComponent(model.QueryComponents())
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DBuyRobotMenu:
		canBuy, err := model.QueryRobotCanBuy()
		if err != nil {
			return origin, err
		}
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringRobotProto(canBuy)
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DBuyPilotMenu:
		canBuy, err := model.QueryPilotCanBuy()
		if err != nil {
			return origin, err
		}
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringPilotProto(canBuy)
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DBuyWeaponMenu:
		canBuy, err := model.QueryWeaponCanBuy()
		if err != nil {
			return origin, err
		}
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringWeaponProto(canBuy)
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	case uidata.Menu1DBuyComponentMenu:
		canBuy, err := model.QueryComponentCanBuy()
		if err != nil {
			return origin, err
		}
		menu := ctx.Menu1Ds[menuID]
		menu.Options = data.KesStringComponentProto(canBuy)
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, menuID, menu)
	default:
		fmt.Printf("PrepareMenu not found %v. ignore.\n", menuID)
		return ctx, nil
	}
	return ctx, nil
}
