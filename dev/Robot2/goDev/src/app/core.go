package app

import (
	"app/tool"
	"app/tool/data"
	"app/tool/def"
	"app/tool/uidata"
	"app/tool/viewer"
	"fmt"
	"tool/astar"

	"github.com/gopherjs/gopherjs/js"
)

var (
	view  viewer.IViwer = def.View
	model IModel        = &DefaultModel{App: data.DefaultApp}
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
	view.Render(ctx)
}

func Main() {
	tree, _ := astar.ShortedPathTree(
		1,
		func(curr *astar.Node) (bool, bool) {
			v := curr.Pather.(int)
			return v == 5, true
		},
		func(curr *astar.Node) []interface{} {
			v := curr.Pather.(int)
			return []interface{}{v + 1}
		},
		func(curr *astar.Node, neighbor interface{}) float64 {
			return 1
		},
		func(curr *astar.Node) float64 {
			return 1
		},
	)
	path := astar.BuildPath(tree[4])
	js.Global.Get("console").Call("log", tree, path)

	defer func() {
		if x := recover(); x != nil {
			fmt.Printf("error: %v\n", x)
			switch detail := x.(type) {
			case string:
				view.Alert(detail)
			case error:
				view.Alert(detail.Error())
			default:
				view.Alert(fmt.Sprintf("%v", x))
			}
			panic(x)
		}
	}()
	view.Install()
	StartPagePhase(uidata.DefaultUI)
	fmt.Println("model done")
}
