package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"math/rand"
)

func NewModel(origin types.Model, situation interface{}) (types.Model, error) {
	var err error
	ctx := origin
	const (
		playerAI1 = "ai1"
	)
	switch detail := situation.(type) {
	case protocol.NewGameplayWithSelection:
		rand.Seed(0)
		selectLevelSelection := detail.SelectLevelSelection
		selection := detail.Selection
		{
			gameplay := types.DefaultGameplay
			// state
			gameplay.State = protocol.GameplayModelStatePlaying
			// ai版本
			gameplay.AIModel = types.AIModel{}
			// 地圖
			var tmpMap [][]int
			{
				offset := selectLevelSelection.Cursor * uidata.MapWidth
				switch selectLevelSelection.MenuID {
				case uidata.Menu1DGroundLevelMenu:
					tmpMap, err = helper.GenerateMap(helper.GenerateMapConfigDefault, 0, 0, 1, uidata.MapWidth, uidata.MapHeight, offset, offset)
					if err != nil {
						return origin, err
					}
				case uidata.Menu1DSeaLevelMenu:
					tmpMap, err = helper.GenerateMap(helper.GenerateMapConfigIsland, 0, 0, 1, uidata.MapWidth, uidata.MapHeight, offset, offset)
					if err != nil {
						return origin, err
					}
				case uidata.Menu1DRandomLevelMenu:
					tmpMap, err = helper.GenerateMap(helper.GenerateMapConfig{
						Deepsea:  rand.Float64(),
						Sea:      rand.Float64(),
						Sand:     rand.Float64(),
						Grass:    rand.Float64(),
						Mountain: rand.Float64(),
						City:     rand.Float64(),
						Tree:     rand.Float64(),
					}, 0, 0, 1, uidata.MapWidth, uidata.MapHeight, offset, offset)
					if err != nil {
						return origin, err
					}
				}
			}
			if tmpMap == nil {
				return origin, fmt.Errorf("tmpMap為nil, 必須建立地圖")
			}
			gameplay.Map = tmpMap
			// 參與玩家
			gameplay.Players = map[string]protocol.Player{
				protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
				playerAI1:               {ID: playerAI1, GroupID: "1"},
			}
			// 玩家行動順序
			gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
			// 主動玩家
			gameplay.ActivePlayerID = protocol.PlayerIDPlayer
			// 駕駛
			gameplay.Pilots = ctx.App.Lobby.Pilots
			// 套用
			ctx.App.Gameplay = gameplay
		}
		var i int
		// 使用所選的建立機體
		for robotID, isSelection := range selection {
			if isSelection == false {
				continue
			}
			robot, has := ctx.App.Lobby.Robots[robotID]
			if has == false {
				return origin, fmt.Errorf("正在使用選擇的機體建立關卡，但所選擇的機體(%v)找不到", robotID)
			}
			robot.PlayerID = protocol.PlayerIDPlayer
			robot.PilotID, has = ctx.App.Lobby.PilotIDByRobotID[robotID]
			if has == false {
				return origin, fmt.Errorf("正在使用選擇的機體建立關卡，但所選擇的機體(%v)找不到駕駛", robotID)
			}
			power, err := common.QueryRobotPower(ctx, robot.ID, false)
			if err != nil {
				return origin, err
			}
			if power <= 0 {
				return origin, fmt.Errorf("正在使用選擇的機體建立關卡，但所選擇的機體(%v)的剩餘出力小於0", robotID)
			}
			ctx, _, err = common.NewRobot(ctx, protocol.Position{0, i}, robot)
			if err != nil {
				return origin, err
			}
			i++
		}
		{
			enemyPower := selectLevelSelection.Cursor * 200000
			// 敵機
			ctx, err = GenerateLevelByHC(ctx, playerAI1, protocol.Position{uidata.MapWidth - 5, uidata.MapHeight - 5}, enemyPower)
			if err != nil {
				return origin, err
			}
		}

	case protocol.NewModelWithTest:
		{
			lobby := types.DefaultLobby
			lobby.Weapons = map[string]protocol.Weapon{
				"lobbyWeapon_0": {
					ID:      "lobbyWeapon_0",
					ProtoID: "beam_mega1",
				},
				"lobbyWeapon_1": {
					ID:      "lobbyWeapon_1",
					ProtoID: "beam_sniper1",
				},
			}
			lobby.RobotIDByWeaponID = map[string]string{
				"lobbyWeapon_0": "0",
				"lobbyWeapon_1": "0",
			}
			ctx.App.Lobby = lobby
		}
		{
			gameplay := types.DefaultGameplay
			gameplay.AIModel = types.AIModel{}
			gameplay.Map, err = helper.GenerateMap(helper.GenerateMapConfigIsland, 0, 0, 1, uidata.MapWidth, uidata.MapHeight, 0, 0)
			if err != nil {
				return origin, err
			}
			gameplay.Players = map[string]protocol.Player{
				protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
				playerAI1:               {ID: playerAI1, GroupID: "1"},
			}
			gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
			gameplay.ActivePlayerID = protocol.PlayerIDPlayer
			gameplay.Pilots = map[string]protocol.Pilot{
				"pilotA": {ID: "pilotA", ProtoID: "amuro"},
				"pilotB": {ID: "pilotB", ProtoID: "baseballPitcher"},
				"pilotC": {ID: "pilotC", ProtoID: "teacher"},
				"pilotD": {ID: "pilotD", ProtoID: "engineer"},
			}
			gameplay.Units = []string{}
			ctx.App.Gameplay = gameplay
		}
		ctx, _, err = common.NewRobot(ctx, protocol.Position{0, 0}, protocol.Robot{
			ID:       "0",
			ProtoID:  "zgundam",
			PlayerID: protocol.PlayerIDPlayer,
			PilotID:  "pilotA",
		})
		if err != nil {
			return origin, err
		}
		ctx, _, err = common.NewRobot(ctx, protocol.Position{10, 10}, protocol.Robot{
			ProtoID:  "gaite_sky",
			PlayerID: protocol.PlayerIDPlayer,
			PilotID:  "pilotB",
		})
		if err != nil {
			return origin, err
		}
		ctx, _, err = common.NewRobot(ctx, protocol.Position{10, 0}, protocol.Robot{
			ProtoID:  "gundam",
			PlayerID: playerAI1,
			PilotID:  "pilotC",
		})
		if err != nil {
			return origin, err
		}
		ctx, _, err = common.NewRobot(ctx, protocol.Position{0, 10}, protocol.Robot{
			ProtoID:  "gundam",
			PlayerID: playerAI1,
			PilotID:  "pilotD",
		})
		if err != nil {
			return origin, err
		}
	default:
		{
			lobby := types.DefaultLobby
			for i, protoID := range data.GameData.Config["default"].Robots {
				id := fmt.Sprintf("DefaultRobot_%v", i)
				obj := protocol.Robot{
					ID:                 id,
					ProtoID:            protoID,
					Transform:          protoID,
					PlayerID:           protocol.PlayerIDPlayer,
					WeaponsByTransform: map[string]protocol.Weapons{},
				}
				lobby.Robots = protocol.AssocStringRobot(lobby.Robots, obj.ID, obj)
			}

			for i, protoID := range data.GameData.Config["default"].Pilots {
				id := fmt.Sprintf("DefaultPilot_%v", i)
				obj := protocol.Pilot{
					ID:      id,
					ProtoID: protoID,
				}
				lobby.Pilots = protocol.AssocStringPilot(lobby.Pilots, obj.ID, obj)
			}

			for i, protoID := range data.GameData.Config["default"].Weapons {
				id := fmt.Sprintf("DefaultWeapon_%v", i)
				obj := protocol.Weapon{
					ID:      id,
					ProtoID: protoID,
				}
				lobby.Weapons = protocol.AssocStringWeapon(lobby.Weapons, obj.ID, obj)
			}

			for i, protoID := range data.GameData.Config["default"].Components {
				id := fmt.Sprintf("DefaultComponent_%v", i)
				obj := protocol.Component{
					ID:      id,
					ProtoID: protoID,
				}
				lobby.Components = protocol.AssocStringComponent(lobby.Components, obj.ID, obj)
			}

			ctx.App.Lobby = lobby
			ctx.App.Money = 100000
		}
	}
	return ctx, nil
}
