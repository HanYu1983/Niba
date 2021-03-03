package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/data"
	"app/tool/def"
	"app/tool/protocol"
	"fmt"
	"strings"
	"tool/log"
)

func QueryActivePlayer(origin types.Model) (protocol.Player, error) {
	return protocol.TryGetStringPlayer(origin.App.Gameplay.Players, origin.App.Gameplay.ActivePlayerID)
}
func NextPlayer(origin types.Model) (types.Model, error) {
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
func QueryUnitsByRegion(origin types.Model, p1 protocol.Position, p2 protocol.Position) []string {
	ctx := origin
	return common.SearchUnitByRegion(ctx.App.Gameplay.Positions, p1, p2)
}
func QueryUnitByPosition(origin types.Model, pos protocol.Position) string {
	ctx := origin
	return common.SearchUnitByPosition(ctx.App.Gameplay.Positions, pos)
}
func GetGameplayRobots(origin types.Model) map[string]protocol.Robot {
	ctx := origin
	return ctx.App.Gameplay.Robots
}
func GetGameplayItems(origin types.Model) map[string]protocol.Item {
	ctx := origin
	return ctx.App.Gameplay.Items
}
func GetGameplayPositions(origin types.Model) map[string]protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Positions
}
func GetGameplayTags(origin types.Model) map[string]protocol.Tag {
	ctx := origin
	return ctx.App.Gameplay.Tags
}
func SetCursor(origin types.Model, cursor protocol.Position) types.Model {
	ctx := origin
	ctx.App.Gameplay.Cursor = cursor
	return ctx
}
func GetCursor(origin types.Model) protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Cursor
}
func GetMap(origin types.Model) [][]int {
	ctx := origin
	return ctx.App.Gameplay.Map
}
func QueryMoveCount(origin types.Model, robotID string) int {
	ctx := origin
	log.Log(protocol.LogCategoryInfo, "QueryMoveCount", fmt.Sprintf("tags(%+v)\n", ctx.App.Gameplay.Tags[robotID]))
	return ctx.App.Gameplay.Tags[robotID].MoveCount
}

func RobotDone(origin types.Model, robotID string) (types.Model, error) {
	ctx := origin
	tags := ctx.App.Gameplay.Tags[robotID]
	tags.IsDone = true
	ctx.App.Gameplay.Tags = protocol.AssocStringTag(ctx.App.Gameplay.Tags, robotID, tags)
	return ctx, nil
}
func RobotSkyGround(origin types.Model, robotID string) (types.Model, error) {
	return origin, nil
}

func GetRobotMenu(origin types.Model) protocol.RobotMenu {
	ctx := origin
	return ctx.App.Gameplay.RobotMenu
}
func SetMoveRange(origin types.Model, moveRange []protocol.Position) types.Model {
	ctx := origin
	ctx.App.Gameplay.MoveRange = moveRange
	return ctx
}
func GetMoveRange(origin types.Model) []protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.MoveRange
}

func GetBattleMenu(origin types.Model) protocol.BattleMenu {
	ctx := origin
	return ctx.App.Gameplay.BattleMenu
}

func OnRobotBattleEnd(origin types.Model, robotAfter protocol.Robot, targetRobotAfter protocol.Robot) (types.Model, error) {
	ctx := origin
	view := def.View
	msg := []string{}
	if robotAfter.PlayerID == protocol.PlayerIDPlayer {
		if targetRobotAfter.HP <= 0 {
			awardMoney := 0
			{
				robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, targetRobotAfter.ProtoID)
				if err != nil {
					return origin, err
				}
				awardMoney = robotProto.Cost
			}
			ctx.App.Money += awardMoney
			msg = append(msg, fmt.Sprintf("獲得%v資金", awardMoney))
		}
	}
	if len(msg) > 0 {
		view.Alert(strings.Join(msg, "\n"))
	}
	return ctx, nil
}
