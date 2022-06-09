package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/helper"
	"app/tool/protocol"
	"testing"
)

func TestQueryMostCloseEnemyPosition(t *testing.T) {
	const (
		playerAI1 = "playerAI1"
	)
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfig{
		Deepsea:  1,
		Sea:      1,
		Sand:     1,
		Grass:    1,
		Mountain: 1,
		City:     0.2,
		Tree:     0.3,
		Award:    0.1,
	}, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	mockModel := types.Model{}
	mockModel.App.Gameplay.Map = tempMap
	mockModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	mockModel.App.Gameplay.Units = []string{"0", "1"}
	mockModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:                 "0",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		EN:                 100,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "1": {
		ID:                 "1",
		ProtoID:            "gundam",
		PlayerID:           playerAI1,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {24, 24}}
	pos, find, err := QueryMostCloseEnemyPosition(mockModel, "1")
	if err != nil {
		t.Fatal(err)
	}
	if find == false {
		t.Fatal("find must be true")
	}
	aPos := protocol.Position{0, 0}
	if pos != aPos {
		t.Fatal("find pos must be (0,0)")
	}
}
