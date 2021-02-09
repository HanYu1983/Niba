package v1

import "app/tool/uidata"

func ObservePage(origin uidata.UI, pageID string) (uidata.UI, error) {
	var err error
	ctx := origin
	model := ctx.Model.(model)
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
	ctx.Info.Money = QueryMoney(model)
	ctx.Info.Robots = QueryRobots(model)
	ctx.Info.Pilots = QueryPilots(model)
	ctx.Info.Weapons = QueryWeapons(model)
	ctx.Info.Components = QueryComponents(model)
	ctx.Info.CanBuyRobots = QueryRobotCanBuy(model)
	ctx.Info.CanBuyPilots = QueryPilotCanBuy(model)
	ctx.Info.CanBuyWeapons = QueryWeaponCanBuy(model)
	ctx.Info.CanBuyComponents = QueryComponentCanBuy(model)
	ctx.Info.PilotIDByRobotID = QueryPilotIDByRobotID(model)
	ctx.Info.RobotIDByWeaponID = QueryRobotIDByWeaponID(model)
	ctx.Info.RobotIDByComponentID = QueryRobotIDByComponentID(model)
	return ctx, nil
}
