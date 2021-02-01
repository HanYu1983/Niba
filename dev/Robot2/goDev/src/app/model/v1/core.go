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

	const (
		playerAI1 = "ai1"
	)

	DefaultModel.App.Money = 10000
	DefaultModel.App.Gameplay.Map = temp
	DefaultModel.App.Gameplay.Units = []string{"0", "1"}
	DefaultModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {GroupID: "0"},
		playerAI1:               {GroupID: "1"},
	}
	DefaultModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
		Title:    "gundam",
	}, "1": {
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
	}, "2": {
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		Title:    "playerAI1",
	}}
	DefaultModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {5, 5}, "2": {3, 0}}
}

func (v *model) DisableBattleMenu() error {
	v.App.Gameplay.BattleMenu.Active = false
	return nil
}
func (v *model) GetBattleMenu() protocol.BattleMenu {
	return v.App.Gameplay.BattleMenu
}

func (v *model) Battle(robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (protocol.BattleResultSet, error) {
	robot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, robotID)
	if err != nil {
		return protocol.BattleResultSet{}, err
	}
	targetRobot, err := protocol.TryGetStringRobot(v.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return protocol.BattleResultSet{}, err
	}
	results := []protocol.BattleResult{}
	// shoot
	results = append(results, protocol.BattleResult{
		Type:        protocol.BattleResultTypeWeapon,
		RobotBefore: robot,
		RobotAfter:  robot,
		Damage:      0,
	})
	// damage
	results = append(results, protocol.BattleResult{
		Type:        protocol.BattleResultTypeDamage,
		RobotBefore: targetRobot,
		RobotAfter:  targetRobot,
		Damage:      1000,
	})
	// counter
	results = append(results, protocol.BattleResult{
		Type:        protocol.BattleResultTypeWeapon,
		RobotBefore: targetRobot,
		RobotAfter:  targetRobot,
		Damage:      0,
	})
	// damage
	results = append(results, protocol.BattleResult{
		Type:        protocol.BattleResultTypeDamage,
		RobotBefore: robot,
		RobotAfter:  robot,
		Damage:      1000,
	})
	return protocol.BattleResultSet{Results: results}, nil
}
