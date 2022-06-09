package v1

import (
	"app/tool/def"
	"app/tool/protocol"
	"testing"
)

func TestOnPlayerTurnStart(t *testing.T) {
	const (
		playerAI1 = "playerAI1"
	)
	mockModel := DefaultModel
	mockModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	mockModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:                 "0",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	mockModel.App.Gameplay.Tags = map[string]protocol.Tag{
		"0": {
			IsDone: true,
		},
	}
	ctx := def.DefaultUI
	ctx.Model = mockModel
	{
		player := mockModel.App.Gameplay.Players[playerAI1]
		_, err := OnPlayerTurnStart(ctx, player)
		if err != nil {
			t.Error(err.Error())
		}
	}
}
