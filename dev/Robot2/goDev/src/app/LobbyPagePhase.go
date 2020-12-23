package app

import (
	"app/tool/data"
	"app/tool/uidata"
	"fmt"
)

func BuyPhase(origin uidata.UI, pageID int) (uidata.UI, error) {
	fmt.Println("BuyPhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, true)
	ctx, err = BasicPagePhase(
		ctx,
		pageID,
		func(origin uidata.UI) (uidata.UI, error) {
			ctx := origin
			switch {
			case pageID == uidata.PageBuyRobot:
				{
					robots := model.QueryRobots()
					titles := data.KesStringRobot(robots)
					titles = append([]string{uidata.MenuOptionCreateNew}, titles...)
					ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DRobotListMenu, uidata.Menu1D{
						Options: titles,
						Limit:   10,
					})
				}
				{
					canBuy, err := model.QueryRobotCanBuy()
					if err != nil {
						return origin, err
					}
					ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DBuyRobotMenu, uidata.Menu1D{
						Options: data.KesStringRobotProto(canBuy),
						Limit:   10,
					})
				}
			case pageID == uidata.PageBuyPilot:
				{
					vs := model.QueryPilots()
					titles := data.KesStringPilot(vs)
					titles = append([]string{uidata.MenuOptionCreateNew}, titles...)
					ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DRobotListMenu, uidata.Menu1D{
						Options: titles,
						Limit:   10,
					})
				}
				{
					canBuy, err := model.QueryPilotCanBuy()
					if err != nil {
						return origin, err
					}
					ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, uidata.Menu1DBuyPilotMenu, uidata.Menu1D{
						Options: data.KesStringPilotProto(canBuy),
						Limit:   10,
					})
				}
			}
			return ctx, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[pageID][focus]
			switch menuID {
			case uidata.Menu1DRobotListMenu, uidata.Menu1DPilotListMenu:
				if cancel {
					return ctx, cancel, nil
				}
				switch selection {
				case uidata.MenuOptionCreateNew:
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]+1)
				default:
					// ignore
				}
			case uidata.Menu1DBuyRobotMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyRobot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			case uidata.Menu1DBuyPilotMenu:
				if cancel {
					ctx.Focus = uidata.AssocIntInt(ctx.Focus, pageID, ctx.Focus[pageID]-1)
					return ctx, false, nil
				}
				err = model.BuyPilot(selection)
				if err != nil {
					view.Alert(err.Error())
				}
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, pageID, false)
	fmt.Println("BuyPhase: End")
	return ctx, nil
}

func LobbyPagePhase(origin uidata.UI) (uidata.UI, error) {
	fmt.Println("LobbyPagePhase")
	var err error
	ctx := origin
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, true)
	ctx, err = BasicPagePhase(
		ctx,
		uidata.PageLobby,
		func(origin uidata.UI) (uidata.UI, error) {
			return origin, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			ctx := origin
			menuID := ctx.Menus[uidata.PageLobby][focus]
			switch menuID {
			case uidata.Menu1DLobbyMenu:
				switch selection {
				case uidata.MenuOptionBuyPilot:
					ctx, err = BuyPhase(ctx, uidata.PageBuyPilot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionBuyRobot:
					ctx, err = BuyPhase(ctx, uidata.PageBuyRobot)
					if err != nil {
						return origin, cancel, err
					}
				case uidata.MenuOptionStartGameplay:
					return ctx, cancel, nil
				}
			}
			return ctx, cancel, nil
		},
		func(origin uidata.UI, focus int, selection string, cancel bool, tab bool) (uidata.UI, bool, error) {
			return origin, cancel, nil
		},
	)
	if err != nil {
		return ctx, err
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageLobby, false)
	fmt.Println("LobbyPagePhase: End")
	return ctx, nil
}
