package protocol

import (
	"tool/astar"
)

type IModel interface {
	// stateStack
	Push()
	Pop()
	Reset()
	// lobby
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
	// gameplay
	ObservePage(ctx interface{}, id int) (interface{}, error)
	QueryActivePlayer() string
	NextPlayer() error
	IsDone() bool
	QueryUnitsByRegion(p1 Position, p2 Position) []string
	QueryUnitByPosition(Position) string
	SetMoveRange([]Position)
	GetMoveRange() []Position
	QueryMoveRangeTree(string) (astar.NodeMap, error)
	QueryMoveCount(string) int
	SetCursor(Position)
	GetCursor() Position
	RobotDone(string) error
	RobotMove(string, Position) error
	RobotTransform(string, string) error
	RobotSkyGround(string) error
	EnableRobotMenu(string, interface{}) error
	DisableRobotMenu() error
	EnableBattleMenu(robotID string, weaponID string, targetRobotID string) error
	DisableBattleMenu() error
	Battle(robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (BattleResultSet, error)
}
