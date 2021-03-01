package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/lobby"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	log.Log(protocol.LogCategoryRender, "ObservePage", fmt.Sprintf("start with pageID(%v)", pageID))
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
	if pageID == uidata.PageLobby {
		model := types.Model(ctx.Model.(Model))
		ctx.Info.Money = model.App.Money
		ctx.Info.Robots, err = common.ObserveRobots(model, model.App.Lobby.Robots, false)
		if err != nil {
			return origin, err
		}
		ctx.Info.Pilots, err = common.ObservePilots(model, model.App.Lobby.Pilots, false)
		if err != nil {
			return origin, err
		}
		ctx.Info.Weapons, err = common.ObserveWeapons(model, "", model.App.Lobby.Weapons, false)
		if err != nil {
			return origin, err
		}
		ctx.Info.Components, err = common.ObserveComponents(model, "", model.App.Lobby.Components, false)
		if err != nil {
			return origin, err
		}
		ctx.Info.CanBuyRobots = lobby.QueryRobotCanBuy(model)
		ctx.Info.CanBuyPilots = lobby.QueryPilotCanBuy(model)
		ctx.Info.CanBuyWeapons = lobby.QueryWeaponCanBuy(model)
		ctx.Info.CanBuyComponents = lobby.QueryComponentCanBuy(model)
		ctx.Info.PilotIDByRobotID = lobby.QueryPilotIDByRobotID(model)
		ctx.Info.RobotIDByWeaponID = lobby.QueryRobotIDByWeaponID(model)
		ctx.Info.RobotIDByComponentID = lobby.QueryRobotIDByComponentID(model)
	}
	log.Log(protocol.LogCategoryRender, "ObservePage", fmt.Sprintf("end with pageID(%v)", pageID))
	return ctx, nil
}
