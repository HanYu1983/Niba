package protocol

import (
	"tool/astar"
)

const (
	GameplayModelStatePlaying = "GameplayModelStatePlaying"
	GameplayModelStateDone    = "GameplayModelStateDone"
)

type StateReasonWin struct {
}

type StateReasonLose struct {
}

type StateReasonGiveUp struct {
}

type IGameplayModel interface {
	ObserveRobot(robot Robot, isGameplay bool) (Robot, error)
	New(situation interface{}) (IModel, error)
	Save() error
	Load() (IModel, error)
	QueryActivePlayer() (Player, error)
	NextPlayer() (IModel, error)
	State() string
	StateReason() interface{}
	QueryUnitsByRegion(p1 Position, p2 Position) []string
	QueryUnitByPosition(Position) string
	SetMoveRange([]Position) IModel
	GetMoveRange() []Position
	QueryMoveRangeTree(string) (astar.NodeMap, error)
	QueryMoveCount(string) int
	SetCursor(Position) IModel
	GetCursor() Position
}
