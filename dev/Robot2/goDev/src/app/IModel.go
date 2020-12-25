package app

import (
	"app/tool/data"
)

type IModel interface {
	Push()
	Pop()
	Reset()
	BuyRobot(id string) error
	BuyPilot(id string) error
	BuyWeapon(id string) error
	BuyComponent(id string) error
	QueryActivePlayer() string
	NextPlayer() error
	HandlePlayerTurnEvent(interface{}) error
	IsDone() bool
	QueryRobotCanBuy() (map[string]data.RobotProto, error)
	QueryPilotCanBuy() (map[string]data.PilotProto, error)
	QueryWeaponCanBuy() (map[string]data.WeaponProto, error)
	QueryComponentCanBuy() (map[string]data.ComponentProto, error)
	QueryRobots() map[string]data.Robot
	QueryPilots() map[string]data.Pilot
	QueryComponents() map[string]data.Component
	QueryWeapons() map[string]data.Weapon
	QueryCursorInMap() (data.Position, error)
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error)
	QueryUnitByPosition(data.Position) (string, error)
	QueryGameplayRobots() map[string]data.Robot
	QueryGameplayItems() map[string]data.Item
	QueryMoney() int
}
