package v1

import (
	"app/model/v1/internal/lobby"
	"app/model/v1/internal/tool/types"
	"app/tool/uidata"
)

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	var err error
	ctx := origin
	for _, menuID := range ctx.Menus[pageID] {
		ctx, err = ObserveMenu1D(ctx, menuID)
		if err != nil {
			return origin, err
		}
		ctx, err = ObserveMenu2D(ctx, menuID)
		if err != nil {
			return origin, err
		}
		ctx, err = ObserveBattleMenu(ctx, menuID)
		if err != nil {
			return origin, err
		}
	}
	if _, has := ctx.GameplayPages[pageID]; has {
		ctx, err = ObserveGameplayPage(ctx, pageID)
		if err != nil {
			return origin, err
		}
	}
	model := types.Model(ctx.Model.(Model))
	ctx.Info.Money = lobby.QueryMoney(model)
	ctx.Info.Robots = lobby.QueryRobots(model)
	ctx.Info.Pilots = lobby.QueryPilots(model)
	ctx.Info.Weapons = lobby.QueryWeapons(model)
	ctx.Info.Components = lobby.QueryComponents(model)
	ctx.Info.CanBuyRobots = lobby.QueryRobotCanBuy(model)
	ctx.Info.CanBuyPilots = lobby.QueryPilotCanBuy(model)
	ctx.Info.CanBuyWeapons = lobby.QueryWeaponCanBuy(model)
	ctx.Info.CanBuyComponents = lobby.QueryComponentCanBuy(model)
	ctx.Info.PilotIDByRobotID = lobby.QueryPilotIDByRobotID(model)
	ctx.Info.RobotIDByWeaponID = lobby.QueryRobotIDByWeaponID(model)
	ctx.Info.RobotIDByComponentID = lobby.QueryRobotIDByComponentID(model)
	return ctx, nil
}
