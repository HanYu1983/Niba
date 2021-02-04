package v1

import (
	"app/tool"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func QueryActivePlayer(origin model) (protocol.Player, error) {
	return protocol.TryGetStringPlayer(origin.App.Gameplay.Players, origin.App.Gameplay.ActivePlayerID)
}
func NextPlayer(origin model) (model, error) {
	ctx := origin
	i := tool.FindStringIndex(ctx.App.Gameplay.PlayerOrder, ctx.App.Gameplay.ActivePlayerID)
	if i == -1 {
		return origin, fmt.Errorf("[model]activePlayer(%v) not found.", i)
	}
	i = (i + 1) % len(origin.App.Gameplay.PlayerOrder)
	nextPlayer := ctx.App.Gameplay.PlayerOrder[i]
	ctx.App.Gameplay.ActivePlayerID = nextPlayer
	return ctx, nil
}
func IsDone(origin model) bool {
	return false
}
func QueryUnitsByRegion(origin model, p1 protocol.Position, p2 protocol.Position) []string {
	ctx := origin
	return SearchUnitByRegion(ctx.App.Gameplay.Positions, p1, p2)
}
func QueryUnitByPosition(origin model, pos protocol.Position) string {
	ctx := origin
	return SearchUnitByPosition(ctx.App.Gameplay.Positions, pos)
}
func GetGameplayRobots(origin model) map[string]protocol.Robot {
	ctx := origin
	return ctx.App.Gameplay.Robots
}
func GetGameplayItems(origin model) map[string]protocol.Item {
	ctx := origin
	return ctx.App.Gameplay.Items
}
func GetGameplayPositions(origin model) map[string]protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Positions
}
func GetGameplayTags(origin model) map[string]protocol.Tag {
	ctx := origin
	return ctx.App.Gameplay.Tags
}
func SetCursor(origin model, cursor protocol.Position) model {
	ctx := origin
	ctx.App.Gameplay.Cursor = cursor
	return ctx
}
func GetCursor(origin model) protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.Cursor
}
func GetMap(origin model) [][]int {
	ctx := origin
	return ctx.App.Gameplay.Map
}
func QueryMoveCount(origin model, robotID string) int {
	ctx := origin
	log.Log(protocol.LogCategoryInfo, "QueryMoveCount", fmt.Sprintf("tags(%+v)\n", ctx.App.Gameplay.Tags[robotID]))
	return ctx.App.Gameplay.Tags[robotID].MoveCount
}

func RobotDone(origin model, robotID string) (model, error) {
	ctx := origin
	tags := ctx.App.Gameplay.Tags[robotID]
	tags.IsDone = true
	ctx.App.Gameplay.Tags = protocol.AssocStringTag(ctx.App.Gameplay.Tags, robotID, tags)
	return ctx, nil
}

func RobotTransform(origin model, robotID string, transformID string) (model, error) {
	return origin, nil
}
func RobotSkyGround(origin model, robotID string) (model, error) {
	return origin, nil
}
func DisableRobotMenu(origin model) (model, error) {
	ctx := origin
	ctx.App.Gameplay.RobotMenu.Active = false
	return ctx, nil
}
func GetRobotMenu(origin model) protocol.RobotMenu {
	ctx := origin
	return ctx.App.Gameplay.RobotMenu
}
func SetMoveRange(origin model, moveRange []protocol.Position) model {
	ctx := origin
	ctx.App.Gameplay.MoveRange = moveRange
	return ctx
}
func GetMoveRange(origin model) []protocol.Position {
	ctx := origin
	return ctx.App.Gameplay.MoveRange
}

func DisableBattleMenu(origin model) (model, error) {
	ctx := origin
	ctx.App.Gameplay.BattleMenu.Active = false
	return ctx, nil
}
func GetBattleMenu(origin model) protocol.BattleMenu {
	ctx := origin
	return ctx.App.Gameplay.BattleMenu
}

func Battle(origin model, robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (model, protocol.BattleResult, error) {
	ctx := origin
	robot, err := protocol.TryGetStringRobot(ctx.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobot, err := protocol.TryGetStringRobot(ctx.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	results := []protocol.BattleAnimation{}
	// shoot
	results = append(results, protocol.BattleAnimation{
		Type:        protocol.BattleResultTypeWeapon,
		RobotBefore: robot,
		RobotAfter:  robot,
		Damage:      0,
	})
	// damage
	results = append(results, protocol.BattleAnimation{
		Type:        protocol.BattleResultTypeDamage,
		RobotBefore: targetRobot,
		RobotAfter:  targetRobot,
		Damage:      1000,
	})
	// counter
	results = append(results, protocol.BattleAnimation{
		Type:        protocol.BattleResultTypeWeapon,
		RobotBefore: targetRobot,
		RobotAfter:  targetRobot,
		Damage:      0,
	})
	// damage
	results = append(results, protocol.BattleAnimation{
		Type:        protocol.BattleResultTypeDamage,
		RobotBefore: robot,
		RobotAfter:  robot,
		Damage:      1000,
	})
	return ctx, protocol.BattleResult{Animations: results}, nil
}

// ai
func QueryUnitsByPlayer(model model, player protocol.Player) ([]string, error) {
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
