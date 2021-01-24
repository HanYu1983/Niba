package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

type lobby struct {
	Robots               map[string]data.Robot
	Pilots               map[string]data.Pilot
	Weapons              map[string]data.Weapon
	Components           map[string]data.Component
	RobotIDByWeaponID    map[string]string
	RobotIDByComponentID map[string]string
	PilotIDByRobotID     map[string]string
}

type gameplay struct {
	Players        map[string]data.Player
	ActivePlayerID string
	Map            [][]int
	Cursor         data.Position
	Units          []string
	Positions      map[string]data.Position
	Robots         map[string]data.Robot
	Tags           map[string]data.Tag
	Items          map[string]data.Item
	Pilots         map[string]data.Pilot
	RobotMenu      protocol.RobotMenu
	Done           interface{}
}

type app struct {
	SeqID    int
	Money    int
	Gameplay gameplay
	Lobby    lobby
}

type model struct {
	App   app
	Stack []app
}

var (
	DefaultModel model
)

func init() {
	temp := [][]int{}
	i := 0
	for y := 0; y < 30; y++ {
		row := []int{}
		for x := 0; x < 30; x++ {
			row = append(row, i%4)
			i++
		}
		temp = append(temp, row)
	}

	DefaultModel.App.Money = 10000
	DefaultModel.App.Gameplay.Map = temp
	DefaultModel.App.Gameplay.Units = []string{"0", "1"}
	DefaultModel.App.Gameplay.Robots = map[string]data.Robot{"0": {}, "1": {}}
	DefaultModel.App.Gameplay.Positions = map[string]data.Position{"0": {0, 0}, "1": {5, 5}}
}
