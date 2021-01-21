package common

import "app/tool/uidata"

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	var err error
	ctx := origin
	for _, menuID := range ctx.Menus[pageID] {
		ctx, err = ObserveMenu(ctx, menuID)
		if err != nil {
			return origin, err
		}
	}
	for ID := range ctx.GameplayPages {
		ctx, err = ObserveGameplayPage(ctx, ID)
		if err != nil {
			return origin, err
		}
	}
	ctx.Info.Money = model.QueryMoney()
	ctx.Info.Robots = model.QueryRobots()
	ctx.Info.Pilots = model.QueryPilots()
	ctx.Info.Weapons = model.QueryWeapons()
	ctx.Info.Components = model.QueryComponents()
	ctx.Info.CanBuyRobots, _ = model.QueryRobotCanBuy()
	ctx.Info.CanBuyPilots, _ = model.QueryPilotCanBuy()
	ctx.Info.CanBuyWeapons, _ = model.QueryWeaponCanBuy()
	ctx.Info.CanBuyComponents, _ = model.QueryComponentCanBuy()
	ctx.Info.PilotIDByRobotID = model.QueryPilotIDByRobotID()
	ctx.Info.RobotIDByWeaponID = model.QueryRobotIDByWeaponID()
	ctx.Info.RobotIDByComponentID = model.QueryRobotIDByComponentID()
	return ctx, nil
}
