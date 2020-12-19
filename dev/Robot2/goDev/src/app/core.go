package app

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/ui_data"
	"app/tool/viewer"
	"fmt"
	"tool/astar"

	"github.com/gopherjs/gopherjs/js"
)

type IModel interface {
	Push()
	Pop()
	Reset()
	BuyRobot(id string) error
	BuyPilot(id string) error
	QueryActivePlayer() string
	NextPlayer() error
	HandlePlayerTurnEvent(interface{}) error
	IsDone() bool
	QueryCursorInMap() (data.Position, error)
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error)
	QueryUnitByPosition(data.Position) (string, error)
	QueryGameplayRobots() map[string]data.Robot
	QueryGameplayItems() map[string]data.Item
}

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
			switch detail := x.(type) {
			case string:
				view.Alert(detail)
			case error:
				view.Alert(detail.Error())
			}
			fmt.Printf("error: %v\n", x)
		}
	}()
	view.Install()
	StartPagePhase(ui_data.DefaultUI)
	fmt.Println("model done")
}
