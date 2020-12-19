package app

import (
	"app/tool/def"
	"app/tool/uidata"
	"app/tool/viewer"
	"fmt"
	"tool/astar"

	"github.com/gopherjs/gopherjs/js"
)

var (
	view  viewer.IViwer = def.View
	model IModel        = &DefaultModel{}
)

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
		}
	}()
	view.Install()
	StartPagePhase(uidata.DefaultUI)
	fmt.Println("model done")
}
