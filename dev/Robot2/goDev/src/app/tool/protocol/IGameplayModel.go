package protocol

import (
	"tool/astar"
)

type IGameplayModel interface {
	// flow
	ObservePage(ctx interface{}, id int) (interface{}, error)
	ObserveRobot(robot Robot) (Robot, error)
	EnemyTurnPhase(ctx interface{}) (interface{}, bool, error)
	// gameplay
	OnPlayerTurnStart(ctx interface{}, player Player) (interface{}, error)
	OnPlayerTurnEnd(ctx interface{}, player Player) (interface{}, error)
	OnRobotBattle(ctx interface{}, robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (interface{}, error)
	New(situation interface{}) (IModel, error)
	Save() error
	Load() (IModel, error)
	QueryActivePlayer() (Player, error)
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
}
