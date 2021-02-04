package v1

import (
	"app/tool/protocol"
)

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
	DefaultModel.App.Gameplay.AIModel = AIModel{}
	DefaultModel.App.Money = 100000
	DefaultModel.App.Gameplay.Map = temp
	DefaultModel.App.Gameplay.Units = []string{"0", "1"}
	DefaultModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	DefaultModel.App.Gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
	DefaultModel.App.Gameplay.ActivePlayerID = protocol.PlayerIDPlayer
	DefaultModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:       "0",
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
		Title:    "gundam",
	}, "1": {
		ID:       "1",
		ProtoID:  "gundam",
		PlayerID: protocol.PlayerIDPlayer,
	}, "2": {
		ID:       "2",
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		Title:    "playerAI1",
	}}
	DefaultModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {5, 5}, "2": {3, 0}}
}
