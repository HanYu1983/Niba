package protocol

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
	QueryRobots() map[string]Robot
	QueryPilots() map[string]Pilot
	QueryWeapons() map[string]Weapon
	QueryComponents() map[string]Component
	QueryRobotIDByWeaponID() map[string]string
	QueryRobotIDByComponentID() map[string]string
	QueryPilotIDByRobotID() map[string]string
	// gameplay
	QueryActivePlayer() string
	NextPlayer() error
	IsDone() bool
	QueryUnitsByRegion(p1 Position, p2 Position) []string
	QueryUnitByPosition(Position) string
	QueryMoveRange(string) []Position
	QueryMoveCount(string) int
	GetGameplayRobots() map[string]Robot
	GetGameplayItems() map[string]Item
	GetGameplayPositions() map[string]Position
	GetMap() [][]int
	SetCursor(Position)
	GetCursor() Position
	RobotMove(string, Position) error
	RobotTransform(string, string) error
	RobotSkyGround(string) error
	EnableRobotMenu(string, interface{}) error
	GetRobotMenu() RobotMenu
}
