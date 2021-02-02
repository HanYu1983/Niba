package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
	"tool/log"
)

// lobby
func BuyRobot(origin model, protoID string) (model, error) {
	ctx := origin
	item, has := data.GameData.Robot[protoID]
	if has == false {
		return origin, fmt.Errorf("BuyRobot [%v] not found", protoID)
	}
	if ctx.App.Money < item.Cost {
		return origin, fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, ctx.App.Money)
	}
	ctx.App.Money -= item.Cost
	ID := strconv.Itoa(ctx.App.SeqID)
	ctx.App.SeqID++
	ctx.App.Lobby.Robots = protocol.AssocStringRobot(ctx.App.Lobby.Robots, ID, protocol.Robot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Robot[protoID].Title,
	})
	return ctx, nil
}
func BuyPilot(origin model, protoID string) (model, error) {
	ctx := origin
	item, has := data.GameData.Pilot[protoID]
	if has == false {
		return origin, fmt.Errorf("BuyPilot [%v] not found", protoID)
	}
	if ctx.App.Money < item.Cost {
		return origin, fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, ctx.App.Money)
	}
	ctx.App.Money -= item.Cost
	ID := strconv.Itoa(ctx.App.SeqID)
	ctx.App.SeqID++
	ctx.App.Lobby.Pilots = protocol.AssocStringPilot(ctx.App.Lobby.Pilots, ID, protocol.Pilot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Pilot[protoID].Title,
	})
	return ctx, nil
}
func BuyWeapon(origin model, protoID string) (model, error) {
	ctx := origin
	item, has := data.GameData.Weapon[protoID]
	if has == false {
		return origin, fmt.Errorf("BuyWeapon [%v] not found", protoID)
	}
	if ctx.App.Money < item.Cost {
		return origin, fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, ctx.App.Money)
	}
	ctx.App.Money -= item.Cost
	ID := strconv.Itoa(ctx.App.SeqID)
	ctx.App.SeqID++
	ctx.App.Lobby.Weapons = protocol.AssocStringWeapon(ctx.App.Lobby.Weapons, ID, protocol.Weapon{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Weapon[protoID].Title,
	})
	return ctx, nil
}
func BuyComponent(origin model, protoID string) (model, error) {
	ctx := origin
	item, has := data.GameData.Component[protoID]
	if has == false {
		return origin, fmt.Errorf("BuyComponent [%v] not found", protoID)
	}
	if ctx.App.Money < item.Cost {
		return origin, fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, ctx.App.Money)
	}
	ctx.App.Money -= item.Cost
	ID := strconv.Itoa(ctx.App.SeqID)
	ctx.App.SeqID++
	ctx.App.Lobby.Components = protocol.AssocStringComponent(ctx.App.Lobby.Components, ID, protocol.Component{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Component[protoID].Title,
	})
	return ctx, nil
}

func AssocRobotPilot(origin model, robotID string, pilotID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.PilotIDByRobotID = data.AssocStringString(ctx.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	return ctx, nil
}
func DissocRobotPilot(origin model, robotID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.PilotIDByRobotID = data.DissocStringString(ctx.App.Lobby.PilotIDByRobotID, robotID)
	return ctx, nil
}
func AssocWeaponRobot(origin model, weaponID string, robotID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByWeaponID = data.AssocStringString(ctx.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return ctx, nil
}
func DissocWeaponRobot(origin model, weaponID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByWeaponID = data.DissocStringString(ctx.App.Lobby.RobotIDByWeaponID, weaponID)
	return ctx, nil
}
func AssocComponentRobot(origin model, componentID string, robotID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByComponentID = data.AssocStringString(ctx.App.Lobby.RobotIDByComponentID, componentID, robotID)
	return ctx, nil
}
func DissocComponentRobot(origin model, componentID string) (model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByComponentID = data.DissocStringString(ctx.App.Lobby.RobotIDByComponentID, componentID)
	return ctx, nil
}
func QueryRobotCanBuy(origin model) map[string]data.RobotProto {
	return data.GameData.Robot
}
func QueryPilotCanBuy(origin model) map[string]data.PilotProto {
	return data.GameData.Pilot
}
func QueryWeaponCanBuy(origin model) map[string]data.WeaponProto {
	return data.GameData.Weapon
}
func QueryComponentCanBuy(origin model) map[string]data.ComponentProto {
	return data.GameData.Component
}
func QueryMoney(origin model) int {
	ctx := origin
	return ctx.App.Money
}
func QueryRobots(origin model) map[string]protocol.Robot {
	ctx := origin
	return ctx.App.Lobby.Robots
}
func QueryPilots(origin model) map[string]protocol.Pilot {
	ctx := origin
	return ctx.App.Lobby.Pilots
}
func QueryComponents(origin model) map[string]protocol.Component {
	ctx := origin
	return ctx.App.Lobby.Components
}
func QueryWeapons(origin model) map[string]protocol.Weapon {
	ctx := origin
	return ctx.App.Lobby.Weapons
}
func QueryRobotIDByWeaponID(origin model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.RobotIDByWeaponID
}
func QueryRobotIDByComponentID(origin model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.RobotIDByComponentID
}
func QueryPilotIDByRobotID(origin model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.PilotIDByRobotID
}

// gameplay

func QueryActivePlayer(origin model) string {
	return protocol.PlayerIDPlayer
}
func NextPlayer(origin model) (model, error) {
	return origin, nil
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
func SetMoveRange(origin model, moveRnage []protocol.Position) model {
	ctx := origin
	ctx.App.Gameplay.MoveRange = moveRnage
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
