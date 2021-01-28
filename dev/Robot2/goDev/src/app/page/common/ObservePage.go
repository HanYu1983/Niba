package common

import (
	"app/tool/def"
	"app/tool/uidata"
)

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	var err error
	ctx := origin
	model := def.Model
	for _, menuID := range ctx.Menus[pageID] {
		ctx, err = ObserveMenu1D(ctx, menuID)
		if err != nil {
			return origin, err
		}
		ctx, err = ObserveMenu2D(ctx, menuID)
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
	ctx.Info.Money = model.QueryMoney()
	ctx.Info.Robots = model.QueryRobots()
	ctx.Info.Pilots = model.QueryPilots()
	ctx.Info.Weapons = model.QueryWeapons()
	ctx.Info.Components = model.QueryComponents()
	ctx.Info.CanBuyRobots = model.QueryRobotCanBuy()
	ctx.Info.CanBuyPilots = model.QueryPilotCanBuy()
	ctx.Info.CanBuyWeapons = model.QueryWeaponCanBuy()
	ctx.Info.CanBuyComponents = model.QueryComponentCanBuy()
	ctx.Info.PilotIDByRobotID = model.QueryPilotIDByRobotID()
	ctx.Info.RobotIDByWeaponID = model.QueryRobotIDByWeaponID()
	ctx.Info.RobotIDByComponentID = model.QueryRobotIDByComponentID()
	return ctx, nil
}
