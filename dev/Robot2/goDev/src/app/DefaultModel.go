package app

import (
	"app/tool/data"
	"fmt"
	"strconv"
)

type DefaultModel struct {
	App   data.App
	Stack []data.App
}

func (v *DefaultModel) Push() {
	v.Stack = append(v.Stack, v.App)
}
func (v *DefaultModel) Pop() {
	v.Stack = v.Stack[:len(v.Stack)-1]
}
func (v *DefaultModel) Reset() {
	top := v.Stack[len(v.Stack)-1]
	v.App = top
}
func (v *DefaultModel) BuyRobot(protoID string) error {
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
func (v *DefaultModel) BuyPilot(protoID string) error {
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
func (v *DefaultModel) BuyWeapon(protoID string) error {
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
	})
	return nil
}
func (v *DefaultModel) BuyComponent(protoID string) error {
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
	})
	return nil
}

func (v *DefaultModel) AssocRobotPilot(robotID string, pilotID string) error {
	v.App.Lobby.PilotIDByRobotID = data.AssocStringString(v.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	return nil
}
func (v *DefaultModel) DissocRobotPilot(robotID string) error {
	v.App.Lobby.PilotIDByRobotID = data.DissocStringString(v.App.Lobby.PilotIDByRobotID, robotID)
	return nil
}
func (v *DefaultModel) AssocWeaponRobot(weaponID string, robotID string) error {
	v.App.Lobby.RobotIDByWeaponID = data.AssocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return nil
}
func (v *DefaultModel) DissocWeaponRobot(weaponID string) error {
	v.App.Lobby.RobotIDByWeaponID = data.DissocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID)
	return nil
}
func (v *DefaultModel) AssocComponentRobot(componentID string, robotID string) error {
	v.App.Lobby.RobotIDByComponentID = data.DissocStringString(v.App.Lobby.RobotIDByComponentID, robotID)
	return nil
}
func (v *DefaultModel) DissocComponentRobot(componentID string) error {
	v.App.Lobby.RobotIDByComponentID = data.DissocStringString(v.App.Lobby.RobotIDByComponentID, componentID)
	return nil
}
func (v *DefaultModel) QueryActivePlayer() string {
	return ""
}
func (v *DefaultModel) NextPlayer() error {
	return nil
}
func (v *DefaultModel) HandlePlayerTurnEvent(interface{}) error {
	return nil
}
func (v *DefaultModel) IsDone() bool {
	return false
}
func (v *DefaultModel) QueryRobotCanBuy() (map[string]data.RobotProto, error) {
	return data.GameData.Robot, nil
}
func (v *DefaultModel) QueryPilotCanBuy() (map[string]data.PilotProto, error) {
	return data.GameData.Pilot, nil
}
func (v *DefaultModel) QueryWeaponCanBuy() (map[string]data.WeaponProto, error) {
	return data.GameData.Weapon, nil
}
func (v *DefaultModel) QueryComponentCanBuy() (map[string]data.ComponentProto, error) {
	return data.GameData.Component, nil
}

func (v *DefaultModel) QueryCursorInMap() (data.Position, error) {
	return data.Position{}, nil
}
func (v *DefaultModel) QueryUnitsByRegion(p1 data.Position, p2 data.Position) ([]string, error) {
	return nil, nil
}
func (v *DefaultModel) QueryUnitByPosition(data.Position) (string, error) {
	return "", nil
}
func (v *DefaultModel) QueryGameplayRobots() map[string]data.Robot {
	return nil
}
func (v *DefaultModel) QueryGameplayItems() map[string]data.Item {
	return nil
}
func (v *DefaultModel) QueryMoney() int {
	return v.App.Money
}
func (v *DefaultModel) QueryRobots() map[string]data.Robot {
	return v.App.Lobby.Robots
}
func (v *DefaultModel) QueryPilots() map[string]data.Pilot {
	return v.App.Lobby.Pilots
}
func (v *DefaultModel) QueryComponents() map[string]data.Component {
	return v.App.Lobby.Components
}
func (v *DefaultModel) QueryWeapons() map[string]data.Weapon {
	return v.App.Lobby.Weapons
}
func (v *DefaultModel) QueryRobotIDByWeaponID() map[string]string {
	return v.App.Lobby.RobotIDByWeaponID
}
func (v *DefaultModel) QueryRobotIDByComponentID() map[string]string {
	return v.App.Lobby.RobotIDByComponentID
}
func (v *DefaultModel) QueryPilotIDByRobotID() map[string]string {
	return v.App.Lobby.PilotIDByRobotID
}
