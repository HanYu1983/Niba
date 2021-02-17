package v1

import (
	"app/model/v1/internal/impl"
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
	model := impl.Model(ctx.Model.(Model))
	ctx.Info.Money = impl.QueryMoney(model)
	ctx.Info.Robots = impl.QueryRobots(model)
	ctx.Info.Pilots = impl.QueryPilots(model)
	ctx.Info.Weapons = impl.QueryWeapons(model)
	ctx.Info.Components = impl.QueryComponents(model)
	ctx.Info.CanBuyRobots = impl.QueryRobotCanBuy(model)
	ctx.Info.CanBuyPilots = impl.QueryPilotCanBuy(model)
	ctx.Info.CanBuyWeapons = impl.QueryWeaponCanBuy(model)
	ctx.Info.CanBuyComponents = impl.QueryComponentCanBuy(model)
	ctx.Info.PilotIDByRobotID = impl.QueryPilotIDByRobotID(model)
	ctx.Info.RobotIDByWeaponID = impl.QueryRobotIDByWeaponID(model)
	ctx.Info.RobotIDByComponentID = impl.QueryRobotIDByComponentID(model)
	return ctx, nil
}
