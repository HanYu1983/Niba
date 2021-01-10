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
	AssocRobotPilot(robotID string, pilotID string) error
	DissocRobotPilot(robotID string) error
	AssocWeaponRobot(weaponID string, robotID string) error
	DissocWeaponRobot(weaponID string) error
	AssocComponentRobot(componentID string, robotID string) error
	DissocComponentRobot(componentID string) error
	QueryActivePlayer() string
	NextPlayer() error
	IsDone() bool
	QueryRobotCanBuy() (map[string]data.RobotProto, error)
	QueryPilotCanBuy() (map[string]data.PilotProto, error)
	QueryWeaponCanBuy() (map[string]data.WeaponProto, error)
	QueryComponentCanBuy() (map[string]data.ComponentProto, error)
	QueryRobots() map[string]data.Robot
	QueryPilots() map[string]data.Pilot
	QueryWeapons() map[string]data.Weapon
	QueryComponents() map[string]data.Component
	QueryRobotIDByWeaponID() map[string]string
	QueryRobotIDByComponentID() map[string]string
	QueryPilotIDByRobotID() map[string]string
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error)
	QueryUnitByPosition(data.Position) (string, error)
	QueryGameplayRobots() map[string]data.Robot
	QueryGameplayItems() map[string]data.Item
	QueryMoney() int
}
