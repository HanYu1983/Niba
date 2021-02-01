package v1

import (
	"app/tool/uidata"
)

func (model *model) ObservePage(origin interface{}, pageID int) (interface{}, error) {
	var err error
	ctx := origin.(uidata.UI)
	for _, menuID := range ctx.Menus[pageID] {
		ctx, err = model.ObserveMenu1D(ctx, menuID)
		if err != nil {
			return origin, err
		}
		ctx, err = model.ObserveMenu2D(ctx, menuID)
		if err != nil {
			return origin, err
		}
		ctx, err = model.ObserveBattleMenu(ctx, menuID)
		if err != nil {
			return origin, err
		}
	}
	if _, has := ctx.GameplayPages[pageID]; has {
		ctx, err = model.ObserveGameplayPage(ctx, pageID)
		if err != nil {
			return origin, err
		}
	}
	if pageID == uidata.PageLobby {
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
	}
	return ctx, nil
}
