package app

import (
	"app/tool/data"
	"app/tool/uidata"
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
	QueryRobotCanBuy() (map[string]data.RobotProto, error)
	QueryPilotCanBuy() (map[string]data.PilotProto, error)
	QueryCursorInMap() (data.Position, error)
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error)
	QueryUnitByPosition(data.Position) (string, error)
	QueryGameplayRobots() map[string]data.Robot
	QueryGameplayItems() map[string]data.Item
	QueryGameInfo() uidata.GameInfo
}
