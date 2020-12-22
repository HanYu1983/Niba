package app

import (
	"app/tool/data"
	"app/tool/uidata"
	"fmt"
)

func LobbyPagePhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("LobbyPagePhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, true)
	{
		canBuy, err := model.QueryRobotCanBuy()
		if err != nil {
			return origin, err
		}
		ctx.CanBuyRobots = canBuy
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DBuyRobotMenu, uidata.Menu1D{
			Options: data.KesStringRobotProto(canBuy),
			Limit:   10,
		})
	}
	{
		canBuy, err := model.QueryPilotCanBuy()
		if err != nil {
			return origin, err
		}
		ctx.CanBuyPilots = canBuy
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DBuyPilotMenu, uidata.Menu1D{
			Options: data.KesStringPilotProto(canBuy),
			Limit:   10,
		})
	}
	ctx, err = BasicPagePhase(
		ctx,
		uidata.PageLobby,
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[uidata.PageLobby][focus]
			switch menuID {
			case uidata.Menu1DBuyRobotMenu:
				err = model.BuyRobot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyPilotMenu:
				err = model.BuyPilot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DLobbyMenu:
				switch selection {
				case uidata.MenuOptionStartGameplay:
					return ctx, true, nil
				}
			}
			return ctx, false, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, false, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, false)
	return ctx, nil
}
