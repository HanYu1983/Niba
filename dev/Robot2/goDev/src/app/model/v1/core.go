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
			row = append(row, i%6)
			i++
		}
		temp = append(temp, row)
	}

	DefaultModel.App.Money = 10000
	DefaultModel.App.Gameplay.Map = temp
	DefaultModel.App.Gameplay.Units = []string{"0", "1"}
	DefaultModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ProtoID: "gundam",
	}, "1": {
		ProtoID: "gundam",
	}}
	DefaultModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {5, 5}}
}

func isFriendlyRobot(app app, unitID1 string, unitID2 string) (bool, error) {
	unit1, err := protocol.TryGetStringRobot(app.Gameplay.Robots, unitID1)
	if err != nil {
		return false, err
	}
	unit2, err := protocol.TryGetStringRobot(app.Gameplay.Robots, unitID2)
	if err != nil {
		return false, err
	}
	plyr1, err := protocol.TryGetStringPlayer(app.Gameplay.Players, unit1.PlayerID)
	if err != nil {
		return false, err
	}
	plyr2, err := protocol.TryGetStringPlayer(app.Gameplay.Players, unit2.PlayerID)
	if err != nil {
		return false, err
	}
	return plyr1.GroupID == plyr2.GroupID, nil
}

func isFriendlyCell(app app, unitID string, pos protocol.Position) (bool, error) {
	unitAtPos := SearchUnitByPosition(app.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos == notFound {
		return true, nil
	}
	if robot, is := app.Gameplay.Robots[unitAtPos]; is {
		return isFriendlyRobot(app, unitID, robot.ID)
	}
	if item, is := app.Gameplay.Items[unitAtPos]; is {
		var _ = item
		return true, nil
	}
	return false, nil
}
