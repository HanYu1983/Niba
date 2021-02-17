package impl

import (
	"app/tool"
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func NewModel(origin Model, situation interface{}) (Model, error) {
	//rand.Seed(0)
	ctx := origin
	const (
		playerAI1 = "ai1"
	)
	tempMap, err := helper.GenerateMap(helper.GenerateMapConfigIsland, 0, 0, 1, 25, 25, 0, 0)
	if err != nil {
		return origin, err
	}
	ctx.App.Lobby.Weapons = map[string]protocol.Weapon{
		"lobbyWeapon_0": {
			ID:      "lobbyWeapon_0",
			ProtoID: "beam_mega1",
		},
		"lobbyWeapon_1": {
			ID:      "lobbyWeapon_1",
			ProtoID: "beam_sniper1",
		},
	}
	ctx.App.Lobby.RobotIDByWeaponID = map[string]string{
		"lobbyWeapon_0": "0",
		"lobbyWeapon_1": "0",
	}
	ctx.App.Gameplay.AIModel = AIModel{}
	ctx.App.Money = 100000
	ctx.App.Gameplay.Map = tempMap
	ctx.App.Gameplay.Units = []string{}
	ctx.App.Gameplay.Players = map[string]protocol.Player{
		protocol.PlayerIDPlayer: {ID: protocol.PlayerIDPlayer, GroupID: "0"},
		playerAI1:               {ID: playerAI1, GroupID: "1"},
	}
	ctx.App.Gameplay.PlayerOrder = []string{protocol.PlayerIDPlayer, playerAI1}
	ctx.App.Gameplay.ActivePlayerID = protocol.PlayerIDPlayer
	ctx.App.Gameplay.Pilots = map[string]protocol.Pilot{
		"pilotA": {ID: "pilotA"},
		"pilotB": {ID: "pilotB"},
		"pilotC": {ID: "pilotC"},
		"pilotD": {ID: "pilotD"},
	}
	ctx, _, err = NewRobot(ctx, protocol.Position{0, 0}, protocol.Robot{
		ID:       "0",
		ProtoID:  "zgundam",
		PlayerID: protocol.PlayerIDPlayer,
		PilotID:  "pilotA",
	})
	if err != nil {
		return origin, err
	}
	ctx, _, err = NewRobot(ctx, protocol.Position{10, 10}, protocol.Robot{
		ProtoID:  "gaite_sky",
		PlayerID: protocol.PlayerIDPlayer,
		PilotID:  "pilotB",
	})
	if err != nil {
		return origin, err
	}
	ctx, _, err = NewRobot(ctx, protocol.Position{10, 0}, protocol.Robot{
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		PilotID:  "pilotC",
	})
	if err != nil {
		return origin, err
	}
	ctx, _, err = NewRobot(ctx, protocol.Position{0, 10}, protocol.Robot{
		ProtoID:  "gundam",
		PlayerID: playerAI1,
		PilotID:  "pilotD",
	})
	if err != nil {
		return origin, err
	}
	// ctx, err = GenerateLevelByPSO(ctx, playerAI1)
	// if err != nil {
	// 	return origin, err
	// }
	return ctx, nil
}
func Save(origin Model) error {
	return nil
}
func Load(origin Model) (Model, error) {
	return origin, nil
}
func NewRobot(origin Model, position protocol.Position, robot protocol.Robot) (Model, protocol.Robot, error) {
	var err error
	ctx := origin
	var notFound string
	_, err = data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	if robot.PlayerID == notFound {
		return origin, protocol.Robot{}, fmt.Errorf("robot(%v) PlayerID not found", robot)
	}
	if robot.PilotID == notFound {
		return origin, protocol.Robot{}, fmt.Errorf("robot(%v) PilotID not found", robot)
	}
	_, err = protocol.TryGetStringPilot(ctx.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	if robot.ID == notFound {
		robot.ID = fmt.Sprintf("NewRobot_%v", ctx.App.SeqID)
		ctx.App.SeqID++
	}
	if robot.Transform == notFound {
		robot.Transform = robot.ProtoID
	}
	if robot.Transform != robot.ProtoID {
		return origin, protocol.Robot{}, fmt.Errorf("transform(%v) must equals protoID(%v)", robot.Transform, robot.ProtoID)
	}
	if robot.WeaponsByTransform == nil {
		robot.WeaponsByTransform = map[string]protocol.Weapons{}
	}
	// 先將機器人丟到場上
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	ctx.App.Gameplay.Positions = protocol.AssocStringPosition(ctx.App.Gameplay.Positions, robot.ID, position)
	ctx.App.Gameplay.Units = append(ctx.App.Gameplay.Units, robot.ID)
	// 再計算機器人的狀態
	robot.HP, err = QueryRobotMaxHp(ctx, robot.ID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	robot.EN, err = QueryRobotMaxEn(ctx, robot.ID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	// 算完後再重設
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	return ctx, robot, nil
}

func NewPilot(origin Model, pilot protocol.Pilot) (Model, protocol.Pilot, error) {
	var err error
	ctx := origin
	var notFound string
	_, err = data.TryGetStringPilotProto(data.GameData.Pilot, pilot.ProtoID)
	if err != nil {
		return origin, protocol.Pilot{}, err
	}
	if pilot.ID == notFound {
		pilot.ID = fmt.Sprintf("NewPilot_%v", ctx.App.SeqID)
		ctx.App.SeqID++
	}
	// 算完後再重設
	ctx.App.Gameplay.Pilots = protocol.AssocStringPilot(ctx.App.Gameplay.Pilots, pilot.ID, pilot)
	return ctx, pilot, nil
}

func QueryActivePlayer(origin Model) (protocol.Player, error) {
	return protocol.TryGetStringPlayer(origin.App.Gameplay.Players, origin.App.Gameplay.ActivePlayerID)
}
func NextPlayer(origin Model) (Model, error) {
	ctx := origin
	var notFound string
	if ctx.App.Gameplay.ActivePlayerID == notFound {
		return origin, fmt.Errorf("[model] you must set ActivePlayerID first.")
	}
	i := tool.FindStringIndex(ctx.App.Gameplay.PlayerOrder, ctx.App.Gameplay.ActivePlayerID)
	if i == -1 {
		return origin, fmt.Errorf("[model]activePlayer(%v) not found.", i)
	}
	i = (i + 1) % len(origin.App.Gameplay.PlayerOrder)
	nextPlayer := ctx.App.Gameplay.PlayerOrder[i]
	ctx.App.Gameplay.ActivePlayerID = nextPlayer
	return ctx, nil
}
func IsDone(origin Model) bool {
	return false
}
func QueryUnitsByRegion(origin Model, p1 protocol.Position, p2 protocol.Position) []string {
	ctx := origin
	return SearchUnitByRegion(ctx.App.Gameplay.Positions, p1, p2)
}
func QueryUnitByPosition(origin Model, pos protocol.Position) string {
	ctx := origin
	return SearchUnitByPosition(ctx.App.Gameplay.Positions, pos)
}
func GetGameplayRobots(origin Model) map[string]protocol.Robot {
	ctx := origin
	return ctx.App.Gameplay.Robots
}
func GetGameplayItems(origin Model) map[string]protocol.Item {
	ctx := origin
	return ctx.App.Gameplay.Items
}
func GetGameplayPositions(origin Model) map[string]protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Positions
}
func GetGameplayTags(origin Model) map[string]protocol.Tag {
	ctx := origin
	return ctx.App.Gameplay.Tags
}
func SetCursor(origin Model, cursor protocol.Position) Model {
	ctx := origin
	ctx.App.Gameplay.Cursor = cursor
	return ctx
}
func GetCursor(origin Model) protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Cursor
}
func GetMap(origin Model) [][]int {
	ctx := origin
	return ctx.App.Gameplay.Map
}
func QueryMoveCount(origin Model, robotID string) int {
	ctx := origin
	log.Log(protocol.LogCategoryInfo, "QueryMoveCount", fmt.Sprintf("tags(%+v)\n", ctx.App.Gameplay.Tags[robotID]))
	return ctx.App.Gameplay.Tags[robotID].MoveCount
}

func RobotDone(origin Model, robotID string) (Model, error) {
	ctx := origin
	tags := ctx.App.Gameplay.Tags[robotID]
	tags.IsDone = true
	ctx.App.Gameplay.Tags = protocol.AssocStringTag(ctx.App.Gameplay.Tags, robotID, tags)
	return ctx, nil
}
func RobotSkyGround(origin Model, robotID string) (Model, error) {
	return origin, nil
}

func GetRobotMenu(origin Model) protocol.RobotMenu {
	ctx := origin
	return ctx.App.Gameplay.RobotMenu
}
func SetMoveRange(origin Model, moveRange []protocol.Position) Model {
	ctx := origin
	ctx.App.Gameplay.MoveRange = moveRange
	return ctx
}
func GetMoveRange(origin Model) []protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.MoveRange
}

// func DisableRobotMenu(origin Model) (Model, error) {
// 	ctx := origin
// 	ctx.App.Gameplay.RobotMenu.Active = false
// 	return ctx, nil
// }

// func DisableBattleMenu(origin Model) (Model, error) {
// 	log.Log(protocol.LogCategoryPhase, "DisableBattleMenu", "start")
// 	ctx := origin
// 	ctx.App.Gameplay.BattleMenu.Active = false
// 	ctx, err := DisableRobotMenu(ctx)
// 	if err != nil {
// 		return origin, err
// 	}
// 	log.Log(protocol.LogCategoryDetail, "DisableBattleMenu", fmt.Sprintf("after RobotMenu(%v)", ctx.App.Gameplay.RobotMenu))
// 	log.Log(protocol.LogCategoryPhase, "DisableBattleMenu", "end")
// 	return ctx, nil
// }
func GetBattleMenu(origin Model) protocol.BattleMenu {
	ctx := origin
	return ctx.App.Gameplay.BattleMenu
}

// ai
func QueryUnitsByPlayer(model Model, player protocol.Player) ([]string, error) {
	_, err := protocol.TryGetStringPlayer(model.App.Gameplay.Players, player.ID)
	if err != nil {
		return []string{}, err
	}
	ret := []string{}
	for ID, robot := range model.App.Gameplay.Robots {
		if robot.PlayerID == player.ID {
			ret = append(ret, ID)
		}
	}
	return ret, nil
}

func IsRobotDone(model Model, robotID string) (bool, error) {
	return model.App.Gameplay.Tags[robotID].IsDone, nil
}
