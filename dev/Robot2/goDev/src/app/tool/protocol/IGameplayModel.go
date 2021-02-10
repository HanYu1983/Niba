package protocol

import (
	"tool/astar"
)

type IGameplayModel interface {
	ObservePage(ctx interface{}, id int) (interface{}, error)
	ObserveRobot(robot Robot) (Robot, error)
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
	RobotSkyGround(string) (IModel, error)
	EnableRobotMenu(string, interface{}) (IModel, error)
	DisableRobotMenu() (IModel, error)
	EnableBattleMenu(robotID string, weaponID string, targetRobotID string) (IModel, error)
	DisableBattleMenu() (IModel, error)
}
