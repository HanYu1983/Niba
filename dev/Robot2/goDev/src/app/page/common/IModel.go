package common

import (
	"app/tool/data"
)

type IModel interface {
	// stateStack
	Push()
	Pop()
	Reset()
	// lobby
	QueryMoney() int
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
	QueryRobotCanBuy() map[string]data.RobotProto
	QueryPilotCanBuy() map[string]data.PilotProto
	QueryWeaponCanBuy() map[string]data.WeaponProto
	QueryComponentCanBuy() map[string]data.ComponentProto
	QueryRobots() map[string]data.Robot
	QueryPilots() map[string]data.Pilot
	QueryWeapons() map[string]data.Weapon
	QueryComponents() map[string]data.Component
	QueryRobotIDByWeaponID() map[string]string
	QueryRobotIDByComponentID() map[string]string
	QueryPilotIDByRobotID() map[string]string
	// gameplay
	QueryActivePlayer() string
	NextPlayer() error
	IsDone() bool
	QueryUnitsByRegion(p1 data.Position, p2 data.Position) []string
	QueryUnitByPosition(data.Position) string
	QueryMoveRange(string) []data.Position
	GetGameplayRobots() map[string]data.Robot
	GetGameplayItems() map[string]data.Item
	GetGameplayPositions() map[string]data.Position
	GetMap() [][]int
	SetCursor(data.Position)
	GetCursor() data.Position
}
