package app

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/ui_data"
	"app/tool/viewer"
)

type IModel interface {
	Push()
	Pop()
	Reset()
	BuyRobot(id string)
	BuyPilot(id string)
	QueryActivePlayer() string
	NextPlayer()
	HandlePlayerTurnEvent(interface{}) error
	IsDone() bool
	QueryCursorInMap() data.Position
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error)
	QueryUnitByPosition(data.Position) (string, error)
	QueryGameplayRobots() map[string]data.Robot
	QueryGameplayItems() map[string]data.Item
}

var (
	view  viewer.IViwer = def.View
	model IModel        = nil
)

func Main() {
	view.Install()
	StartPagePhase(ui_data.DefaultUI)
}
