package common

import (
	"app/tool"
	"app/tool/data"
	"app/tool/def"
	"app/tool/uidata"
	"app/tool/viewer"
)

var (
	view  viewer.IViwer = def.View
	model IModel        = &DefaultModel{App: data.DefaultApp}
)

var (
	View  = view
	Model = model
)

const (
	size = 10
)

func Render(ctx uidata.UI) {
	for id, menu := range ctx.Menu1Ds {
		options := menu.Options
		left, right := tool.Max(0, menu.Offset), tool.Min(menu.Offset+menu.Limit, len(options))
		menu.Info.Options = options[left:right]
		menu.Info.Limit = menu.Limit
		menu.Info.Offset = menu.Offset
		menu.Info.Cursor = menu.Cursor
		ctx.Menu1Ds = uidata.AssocIntMenu1D(ctx.Menu1Ds, id, menu)
	}
	for id, menu := range ctx.Menu2Ds {
		menu.Info.Options = menu.Options
		menu.Info.Cursor1 = menu.Cursor1
		menu.Info.Cursor2 = menu.Cursor2
		ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, id, menu)
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
	// ctx.Info.JSON = data.GameData
	view.Render(ctx)
}
