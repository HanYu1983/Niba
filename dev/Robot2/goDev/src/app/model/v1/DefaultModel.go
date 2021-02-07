package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
)

var (
	DefaultModel model
)

func init() {
	const (
		playerAI1 = "ai1"
	)
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfigIsland, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		panic(err)
	}
	DefaultModel.App.Lobby.Weapons = map[string]protocol.Weapon{
		"lobbyWeapon_0": {
			ID:      "lobbyWeapon_0",
			ProtoID: "beam_mega1",
		},
		"lobbyWeapon_1": {
			ID:      "lobbyWeapon_1",
			ProtoID: "beam_sniper1",
		},
	}
	DefaultModel.App.Lobby.RobotIDByWeaponID = map[string]string{
		"lobbyWeapon_0": "0",
		"lobbyWeapon_1": "0",
	}
	DefaultModel.App.Gameplay.AIModel = AIModel{}
	DefaultModel.App.Money = 100000
	DefaultModel.App.Gameplay.Map = tempMap
	DefaultModel.App.Gameplay.Units = []string{"0", "1"}
	DefaultModel.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	DefaultModel.App.Gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
	DefaultModel.App.Gameplay.ActivePlayerID = protocol.PlayerIDPlayer
	DefaultModel.App.Gameplay.Robots = map[string]protocol.Robot{"0": {
		ID:                 "0",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		Title:              "gundam",
		Transform:          "gundam",
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "1": {
		ID:                 "1",
		ProtoID:            "gundam",
		PlayerID:           protocol.PlayerIDPlayer,
		Transform:          "gundam",
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "2": {
		ID:                 "2",
		ProtoID:            "gundam",
		PlayerID:           playerAI1,
		Title:              "playerAI1",
		Transform:          "gundam",
		WeaponsByTransform: map[string]protocol.Weapons{},
	}, "3": {
		ID:                 "3",
		ProtoID:            "gundam",
		PlayerID:           playerAI1,
		Title:              "playerAI1",
		Transform:          "gundam",
		WeaponsByTransform: map[string]protocol.Weapons{},
	}}
	DefaultModel.App.Gameplay.Positions = map[string]protocol.Position{"0": {0, 0}, "1": {10, 10}, "2": {10, 0}, "3": {0, 10}}
}
