package app

import (
	"app/page/common"
	"app/page/gameplay"
	"app/page/title"
	"app/tool/uidata"
	"fmt"
	"tool/astar"

	"github.com/gopherjs/gopherjs/js"
)

var (
	view  = common.View
	model = common.Model
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
			panic(x)
		}
	}()
	view.Install()

	var _ = gameplay.GameLoop
	var _ = title.StartPagePhase
	startPhase := title.StartPagePhase
	_, err := startPhase(uidata.DefaultUI)
	if err != nil {
		panic(err)
	}
	fmt.Println("model done")
}
