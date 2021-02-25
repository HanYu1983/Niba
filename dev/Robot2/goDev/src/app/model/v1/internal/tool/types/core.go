package types

import (
	"app/tool/protocol"
	"tool/nodejs/mlkmeans"
)

type lobby struct {
	Robots               map[string]protocol.Robot
	Pilots               map[string]protocol.Pilot
	Weapons              map[string]protocol.Weapon
	Components           map[string]protocol.Component
	RobotIDByWeaponID    map[string]string
	RobotIDByComponentID map[string]string
	PilotIDByRobotID     map[string]string
}

type gameplay struct {
	AIModel        AIModel
	ActivePlayerID string
	PlayerOrder    []string
	Map            [][]int
	Cursor         protocol.Position
	Units          []string
	Players        map[string]protocol.Player
	Positions      map[string]protocol.Position
	Robots         map[string]protocol.Robot
	Tags           map[string]protocol.Tag
	Items          map[string]protocol.Item
	Pilots         map[string]protocol.Pilot
	HitMarks       map[string]protocol.HitMark
	RobotMenu      protocol.RobotMenu
	BattleMenu     protocol.BattleMenu
	MoveRange      []protocol.Position
	MapAttackRange []protocol.Position
	Done           interface{}
}

type app struct {
	SeqID    int
	Money    int
	Gameplay gameplay
	Lobby    lobby
}

type Model struct {
	App app
}

const (
	GoalTypeAttackTargetRobot = "GoalTypeAttackTargetRobot"
	GoalTypeMoveToPosition    = "GoalTypeMoveToPosition"
	GoalTypeSearchAndAttack   = "GoalTypeSearchAndAttack"
)

type Goal struct {
	Type     string
	RobotID  string
	Position protocol.Position
}

type Memory struct {
	TargetClusters  mlkmeans.KMeansResult
	MyClusters      mlkmeans.KMeansResult
	MyTeamTarget    map[int]int
	TeamIDByRobotID map[string]int
}

type AIModel struct {
	Memory        map[string]Memory
	GoalByRobotID map[string]Goal
}