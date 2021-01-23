package v1

import (
	"app/tool/data"
	"fmt"
	"strconv"
)

func (v *model) BuyRobot(protoID string) error {
	fmt.Printf("BuyRobot(%v)\n", protoID)
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
	v.App.Lobby.Robots = data.AssocStringRobot(v.App.Lobby.Robots, ID, data.Robot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Robot[protoID].Title,
	})
	return nil
}
func (v *model) BuyPilot(protoID string) error {
	fmt.Printf("BuyPilot(%v)\n", protoID)
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
	v.App.Lobby.Pilots = data.AssocStringPilot(v.App.Lobby.Pilots, ID, data.Pilot{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Pilot[protoID].Title,
	})
	return nil
}
func (v *model) BuyWeapon(protoID string) error {
	fmt.Printf("BuyWeapon(%v)\n", protoID)
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
	v.App.Lobby.Weapons = data.AssocStringWeapon(v.App.Lobby.Weapons, ID, data.Weapon{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Weapon[protoID].Title,
	})
	return nil
}
func (v *model) BuyComponent(protoID string) error {
	fmt.Printf("BuyPilot(%v)\n", protoID)
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
	v.App.Lobby.Components = data.AssocStringComponent(v.App.Lobby.Components, ID, data.Component{
		ID:      ID,
		ProtoID: protoID,
		Title:   data.GameData.Component[protoID].Title,
	})
	return nil
}

func (v *model) AssocRobotPilot(robotID string, pilotID string) error {
	fmt.Printf("AssocRobotPilot(%v, %v)\n", robotID, pilotID)
	v.App.Lobby.PilotIDByRobotID = data.AssocStringString(v.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	fmt.Printf("XXXXX(%v)\n", v.App.Lobby.PilotIDByRobotID)
	return nil
}
func (v *model) DissocRobotPilot(robotID string) error {
	fmt.Printf("DissocRobotPilot(%v)\n", robotID)
	v.App.Lobby.PilotIDByRobotID = data.DissocStringString(v.App.Lobby.PilotIDByRobotID, robotID)
	return nil
}
func (v *model) AssocWeaponRobot(weaponID string, robotID string) error {
	fmt.Printf("AssocWeaponRobot(%v, %v)\n", robotID, weaponID)
	v.App.Lobby.RobotIDByWeaponID = data.AssocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return nil
}
func (v *model) DissocWeaponRobot(weaponID string) error {
	fmt.Printf("DissocWeaponRobot(%v)\n", weaponID)
	v.App.Lobby.RobotIDByWeaponID = data.DissocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID)
	return nil
}
func (v *model) AssocComponentRobot(componentID string, robotID string) error {
	fmt.Printf("AssocComponentRobot(%v, %v)\n", robotID, componentID)
	v.App.Lobby.RobotIDByComponentID = data.AssocStringString(v.App.Lobby.RobotIDByComponentID, componentID, robotID)
	return nil
}
func (v *model) DissocComponentRobot(componentID string) error {
	fmt.Printf("DissocComponentRobot(%v)\n", componentID)
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
func (v *model) QueryRobots() map[string]data.Robot {
	return v.App.Lobby.Robots
}
func (v *model) QueryPilots() map[string]data.Pilot {
	return v.App.Lobby.Pilots
}
func (v *model) QueryComponents() map[string]data.Component {
	return v.App.Lobby.Components
}
func (v *model) QueryWeapons() map[string]data.Weapon {
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
