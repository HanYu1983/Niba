package v1

import (
	"app/tool/protocol"
	"testing"
)

func TestIsFriendlyCell(t *testing.T) {
	const (
		playerAI1 = "playerAI1"
	)
	mockModel := Model
	mockModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	mockModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:                 "0",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		EN:                 100,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "1": {
		ID:                 "1",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		EN:                 100,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "2": {
		ID:                 "2",
		ProtoID:            "gundam",
		PlayerID:           playerAI1,
		EN:                 100,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	mockModel.App.Gameplay.Items = map[string]protocol.Item{
		"3": {
			ID: "3",
		},
	}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {1, 0}, "2": {2, 0}, "3": {3, 0}}
	{
		isFriendly, err := IsFriendlyCell(mockModel, "0", protocol.Position{1, 0})
		if err != nil {
			t.Error(err.Error())
		}
		if isFriendly == false {
			t.Error("自機是友好格")
		}
	}
	{
		isFriendly, err := IsFriendlyCell(mockModel, "0", protocol.Position{2, 0})
		if err != nil {
			t.Error(err.Error())
		}
		if isFriendly {
			t.Error("敵機是非友好格")
		}
	}
	{
		isFriendly, err := IsFriendlyCell(mockModel, "0", protocol.Position{3, 0})
		if err != nil {
			t.Error(err.Error())
		}
		if isFriendly == false {
			t.Error("道具是友好格")
		}
	}
	{
		isFriendly, err := IsFriendlyCell(mockModel, "0", protocol.Position{0, 1})
		if err != nil {
			t.Error(err.Error())
		}
		if isFriendly == false {
			t.Error("空地是友好格")
		}
	}
}
