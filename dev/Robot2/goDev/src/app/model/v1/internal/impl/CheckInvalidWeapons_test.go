package impl

import (
	"app/tool/protocol"
	"testing"
)

func TestCheckInvalidWeapons(t *testing.T) {
	const (
		playerAI1 = "playerAI1"
	)
	mockModel := Model{}
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
	}}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}}
	robot := mockModel.App.Gameplay.Robots["0"]
	weapons := map[string]protocol.Weapon{
		"0": {ID: "0", ProtoID: "sword1", BulletCount: 1},
	}
	{
		mockModel.App.Gameplay.Robots["1"] = protocol.Robot{
			ID:                 "1",
			ProtoID:            "gundam",
			PlayerID:           protocol.PlayerIDPlayer,
			WeaponsByTransform: map[string]protocol.Weapons{},
		}
		mockModel.App.Gameplay.Positions["1"] = protocol.Position{1, 0}
		invalids, err := CheckInvalidWeapons(mockModel, robot, weapons)
		if err != nil {
			t.Error(err.Error())
		}
		if invalids["0"] == "" {
			t.Error("都是自機的情況下, 敵人將不在範圍內")
		}
	}

	{
		mockModel.App.Gameplay.Robots["1"] = protocol.Robot{
			ID:                 "1",
			ProtoID:            "gundam",
			PlayerID:           playerAI1,
			WeaponsByTransform: map[string]protocol.Weapons{},
		}
		mockModel.App.Gameplay.Positions["1"] = protocol.Position{1, 0}
		invalids, err := CheckInvalidWeapons(mockModel, robot, weapons)
		if err != nil {
			t.Error(err.Error())
		}
		if invalids["0"] != "" {
			t.Error("敵機在(1,0), 必須沒有無效字串")
		}
	}
}
