package common

import (
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
