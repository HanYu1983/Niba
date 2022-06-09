package v1

import (
	"app/tool/def"
	"app/tool/protocol"
	"testing"
)

func TestOnPlayerTurnEnd(t *testing.T) {
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

	if ctx.Model.(Model).App.Gameplay.Tags["0"].IsDone == false {
		t.Error("請先將IsDone設為true")
	}
	{
		player := mockModel.App.Gameplay.Players[playerAI1]
		ctx, err := OnPlayerTurnEnd(ctx, player)
		if err != nil {
			t.Error(err.Error())
		}
		if ctx.Model.(Model).App.Gameplay.Tags["0"].IsDone == false {
			t.Error("敵人回合結束時和好人無關")
		}
	}
	{
		player := mockModel.App.Gameplay.Players[protocol.PlayerIDPlayer]
		ctx, err := OnPlayerTurnEnd(ctx, player)
		if err != nil {
			t.Error(err.Error())
		}
		if ctx.Model.(Model).App.Gameplay.Tags["0"].IsDone {
			t.Error("好人回合結束時必須恢復IsDone")
		}
	}
}
