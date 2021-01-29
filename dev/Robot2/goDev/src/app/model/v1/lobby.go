package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
)

func (v *model) BuyRobot(protoID string) error {
	item, has := data.GameData.Robot[protoID]
	if has == false {
		return fmt.Errorf("BuyRobot [%v] not found", protoID)
	}
	if v.App.Money < item.Cost {
		return fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, v.App.Money)
	}
	v.App.Money -= item.Cost
	ID := strconv.Itoa(v.App.SeqID)
	v.App.SeqID++
	v.App.Lobby.Robots = protocol.AssocStringRobot(v.App.Lobby.Robots, ID, protocol.Robot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Robot[protoID].Title,
	})
	return nil
}
func (v *model) BuyPilot(protoID string) error {
	item, has := data.GameData.Pilot[protoID]
	if has == false {
		return fmt.Errorf("BuyPilot [%v] not found", protoID)
	}
	if v.App.Money < item.Cost {
		return fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, v.App.Money)
	}
	v.App.Money -= item.Cost
	ID := strconv.Itoa(v.App.SeqID)
	v.App.SeqID++
	v.App.Lobby.Pilots = protocol.AssocStringPilot(v.App.Lobby.Pilots, ID, protocol.Pilot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Pilot[protoID].Title,
	})
	return nil
}
func (v *model) BuyWeapon(protoID string) error {
	item, has := data.GameData.Weapon[protoID]
	if has == false {
		return fmt.Errorf("BuyWeapon [%v] not found", protoID)
	}
	if v.App.Money < item.Cost {
		return fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, v.App.Money)
	}
	v.App.Money -= item.Cost
	ID := strconv.Itoa(v.App.SeqID)
	v.App.SeqID++
	v.App.Lobby.Weapons = protocol.AssocStringWeapon(v.App.Lobby.Weapons, ID, protocol.Weapon{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Weapon[protoID].Title,
	})
	return nil
}
func (v *model) BuyComponent(protoID string) error {
	item, has := data.GameData.Component[protoID]
	if has == false {
		return fmt.Errorf("BuyComponent [%v] not found", protoID)
	}
	if v.App.Money < item.Cost {
		return fmt.Errorf("money is not enough. (%v/ %v)", item.Cost, v.App.Money)
	}
	v.App.Money -= item.Cost
	ID := strconv.Itoa(v.App.SeqID)
	v.App.SeqID++
	v.App.Lobby.Components = protocol.AssocStringComponent(v.App.Lobby.Components, ID, protocol.Component{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Component[protoID].Title,
	})
	return nil
}

func (v *model) AssocRobotPilot(robotID string, pilotID string) error {
	v.App.Lobby.PilotIDByRobotID = data.AssocStringString(v.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	return nil
}
func (v *model) DissocRobotPilot(robotID string) error {
	v.App.Lobby.PilotIDByRobotID = data.DissocStringString(v.App.Lobby.PilotIDByRobotID, robotID)
	return nil
}
func (v *model) AssocWeaponRobot(weaponID string, robotID string) error {
	v.App.Lobby.RobotIDByWeaponID = data.AssocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return nil
}
func (v *model) DissocWeaponRobot(weaponID string) error {
	v.App.Lobby.RobotIDByWeaponID = data.DissocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID)
	return nil
}
func (v *model) AssocComponentRobot(componentID string, robotID string) error {
	v.App.Lobby.RobotIDByComponentID = data.AssocStringString(v.App.Lobby.RobotIDByComponentID, componentID, robotID)
	return nil
}
func (v *model) DissocComponentRobot(componentID string) error {
	v.App.Lobby.RobotIDByComponentID = data.DissocStringString(v.App.Lobby.RobotIDByComponentID, componentID)
	return nil
}
func (v *model) QueryRobotCanBuy() map[string]data.RobotProto {
	return data.GameData.Robot
}
func (v *model) QueryPilotCanBuy() map[string]data.PilotProto {
	return data.GameData.Pilot
}
func (v *model) QueryWeaponCanBuy() map[string]data.WeaponProto {
	return data.GameData.Weapon
}
func (v *model) QueryComponentCanBuy() map[string]data.ComponentProto {
	return data.GameData.Component
}
func (v *model) QueryMoney() int {
	return v.App.Money
}
func (v *model) QueryRobots() map[string]protocol.Robot {
	return v.App.Lobby.Robots
}
func (v *model) QueryPilots() map[string]protocol.Pilot {
	return v.App.Lobby.Pilots
}
func (v *model) QueryComponents() map[string]protocol.Component {
	return v.App.Lobby.Components
}
func (v *model) QueryWeapons() map[string]protocol.Weapon {
	return v.App.Lobby.Weapons
}
func (v *model) QueryRobotIDByWeaponID() map[string]string {
	return v.App.Lobby.RobotIDByWeaponID
}
func (v *model) QueryRobotIDByComponentID() map[string]string {
	return v.App.Lobby.RobotIDByComponentID
}
func (v *model) QueryPilotIDByRobotID() map[string]string {
	return v.App.Lobby.PilotIDByRobotID
}
