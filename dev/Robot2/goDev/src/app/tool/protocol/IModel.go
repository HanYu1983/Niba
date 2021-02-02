package protocol

import (
	"tool/astar"
)

type IModel interface {
	// lobby
	BuyRobot(id string) (IModel, error)
	BuyPilot(id string) (IModel, error)
	BuyWeapon(id string) (IModel, error)
	BuyComponent(id string) (IModel, error)
	AssocRobotPilot(robotID string, pilotID string) (IModel, error)
	DissocRobotPilot(robotID string) (IModel, error)
	AssocWeaponRobot(weaponID string, robotID string) (IModel, error)
	DissocWeaponRobot(weaponID string) (IModel, error)
	AssocComponentRobot(componentID string, robotID string) (IModel, error)
	DissocComponentRobot(componentID string) (IModel, error)
	// gameplay
	ObservePage(ctx interface{}, id int) (interface{}, error)
	EnemyTurnPhase(origin interface{}) (interface{}, bool, error)
	QueryActivePlayer() string
	NextPlayer() (IModel, error)
	IsDone() bool
	QueryUnitsByRegion(p1 Position, p2 Position) []string
	QueryUnitByPosition(Position) string
	SetMoveRange([]Position) IModel
	GetMoveRange() []Position
	QueryMoveRangeTree(string) (astar.NodeMap, error)
	QueryMoveCount(string) int
	SetCursor(Position) IModel
	GetCursor() Position
	RobotDone(string) (IModel, error)
	RobotMove(string, Position) (IModel, error)
	RobotTransform(string, string) (IModel, error)
	RobotSkyGround(string) (IModel, error)
	EnableRobotMenu(string, interface{}) (IModel, error)
	DisableRobotMenu() (IModel, error)
	EnableBattleMenu(robotID string, weaponID string, targetRobotID string) (IModel, error)
	DisableBattleMenu() (IModel, error)
	Battle(robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (IModel, BattleResult, error)
}
