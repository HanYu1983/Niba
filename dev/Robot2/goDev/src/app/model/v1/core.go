package v1

import (
	"app/tool/protocol"
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
	Players        map[string]protocol.Player
	ActivePlayerID string
	Map            [][]int
	Cursor         protocol.Position
	Units          []string
	Positions      map[string]protocol.Position
	Robots         map[string]protocol.Robot
	Tags           map[string]protocol.Tag
	Items          map[string]protocol.Item
	Pilots         map[string]protocol.Pilot
	RobotMenu      protocol.RobotMenu
	BattleMenu     protocol.BattleMenu
	MoveRange      []protocol.Position
	Done           interface{}
}

type app struct {
	SeqID    int
	Money    int
	Gameplay gameplay
	Lobby    lobby
}

type model struct {
	App app
}

type Model model
