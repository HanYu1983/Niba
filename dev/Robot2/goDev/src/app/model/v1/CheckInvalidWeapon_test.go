package v1

import (
	"app/tool/protocol"
	"testing"
)

func TestCheckInvalidWeapon(t *testing.T) {
	const (
		playerAI1 = "playerAI1"
	)
	mockModel := DefaultModel
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
		PlayerID:           protocol.PlayerIDPlayer,
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	mockModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {4, 0}}
	robot := mockModel.App.Gameplay.Robots["0"]
	units := []string{"1"}
	{
		invalid, err := CheckInvalidWeapon(mockModel, robot, protocol.Weapon{
			ProtoID: "sword1",
		}, units)
		if err != nil {
			t.Error(err.Error())
		}
		if invalid == "" {
			t.Errorf("must have 彈藥不足")
		}
	}
	{
		invalid, err := CheckInvalidWeapon(mockModel, robot, protocol.Weapon{
			ProtoID:     "sword1",
			BulletCount: 1,
		}, units)
		if err != nil {
			t.Error(err.Error())
		}
		if invalid == "" {
			t.Errorf("must have 敵人不在範圍內")
		}
	}
	{
		if robot.EN != 100 {
			t.Errorf("robot.EN必須是100")
		}
		invalid, err := CheckInvalidWeapon(mockModel, robot, protocol.Weapon{
			ProtoID: "beam_gun1",
		}, units)
		if err != nil {
			t.Error(err.Error())
		}
		if invalid != "" {
			t.Errorf("beam_gun1射距為2~4, 必須沒有錯誤")
		}
	}
}
