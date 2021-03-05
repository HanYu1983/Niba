package lobby

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
	"tool/log"
)

func BuyRobot(origin types.Model, protoID string) (types.Model, error) {
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
		ID:                 ID,
		ProtoID:            protoID,
		Title:              data.GameData.Robot[protoID].Title,
		Transform:          protoID,
		PlayerID:           protocol.PlayerIDPlayer,
		WeaponsByTransform: map[string]protocol.Weapons{},
	})
	return ctx, nil
}
func BuyPilot(origin types.Model, protoID string) (types.Model, error) {
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
func BuyWeapon(origin types.Model, protoID string) (types.Model, error) {
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
func BuyComponent(origin types.Model, protoID string) (types.Model, error) {
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

func AssocRobotPilot(origin types.Model, robotID string, pilotID string) (types.Model, error) {
	ctx := origin
	ctx.App.Lobby.PilotIDByRobotID = data.AssocStringString(ctx.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	return ctx, nil
}
func DissocRobotPilot(origin types.Model, robotID string) (types.Model, error) {
	ctx := origin
	ctx.App.Lobby.PilotIDByRobotID = data.DissocStringString(ctx.App.Lobby.PilotIDByRobotID, robotID)
	return ctx, nil
}
func AssocWeaponRobot(origin types.Model, weaponID string, robotID string) (types.Model, error) {
	log.Log(protocol.LogCategoryDetail, "AssocWeaponRobot", fmt.Sprintf("weaponID(%v) robotID(%v)", weaponID, robotID))
	ctx := origin
	ctx.App.Lobby.RobotIDByWeaponID = data.AssocStringString(ctx.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return ctx, nil
}
func DissocWeaponRobot(origin types.Model, weaponID string) (types.Model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByWeaponID = data.DissocStringString(ctx.App.Lobby.RobotIDByWeaponID, weaponID)
	return ctx, nil
}
func AssocComponentRobot(origin types.Model, componentID string, robotID string) (types.Model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByComponentID = data.AssocStringString(ctx.App.Lobby.RobotIDByComponentID, componentID, robotID)
	return ctx, nil
}
func DissocComponentRobot(origin types.Model, componentID string) (types.Model, error) {
	ctx := origin
	ctx.App.Lobby.RobotIDByComponentID = data.DissocStringString(ctx.App.Lobby.RobotIDByComponentID, componentID)
	return ctx, nil
}
func QueryRobotCanBuy(origin types.Model) map[string]data.RobotProto {
	canBuy := map[string]data.RobotProto{}
	for protoID, proto := range data.GameData.Robot {
		if proto.UnlockExp < len(origin.App.Lobby.ClearStateByLevelID) {
			continue
		}
		canBuy[protoID] = proto
	}
	return canBuy
}
func QueryPilotCanBuy(origin types.Model) map[string]data.PilotProto {
	canBuy := map[string]data.PilotProto{}
	for protoID, proto := range data.GameData.Pilot {
		if proto.UnlockExp < len(origin.App.Lobby.ClearStateByLevelID) {
			continue
		}
		canBuy[protoID] = proto
	}
	return canBuy
}
func QueryWeaponCanBuy(origin types.Model) map[string]data.WeaponProto {
	canBuy := map[string]data.WeaponProto{}
	for protoID, proto := range data.GameData.Weapon {
		if proto.UnlockExp < len(origin.App.Lobby.ClearStateByLevelID) {
			continue
		}
		canBuy[protoID] = proto
	}
	return canBuy
}
func QueryComponentCanBuy(origin types.Model) map[string]data.ComponentProto {
	canBuy := map[string]data.ComponentProto{}
	for protoID, proto := range data.GameData.Component {
		if proto.UnlockExp < len(origin.App.Lobby.ClearStateByLevelID) {
			continue
		}
		canBuy[protoID] = proto
	}
	return canBuy
}
func QueryRobotIDByWeaponID(origin types.Model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.RobotIDByWeaponID
}
func QueryRobotIDByComponentID(origin types.Model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.RobotIDByComponentID
}
func QueryPilotIDByRobotID(origin types.Model) map[string]string {
	ctx := origin
	return ctx.App.Lobby.PilotIDByRobotID
}
