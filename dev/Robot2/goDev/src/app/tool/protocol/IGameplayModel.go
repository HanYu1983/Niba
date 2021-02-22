package protocol

import (
	"tool/astar"
)

type IGameplayModel interface {
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
}
