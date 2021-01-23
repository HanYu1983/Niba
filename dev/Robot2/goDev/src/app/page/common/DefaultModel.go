package common

import (
	"app/tool/data"
	"fmt"
	"strconv"
)

type Lobby struct {
	Robots               map[string]data.Robot
	Pilots               map[string]data.Pilot
	Weapons              map[string]data.Weapon
	Components           map[string]data.Component
	RobotIDByWeaponID    map[string]string
	RobotIDByComponentID map[string]string
	PilotIDByRobotID     map[string]string
}
type Gameplay struct {
	Players        map[string]data.Player
	ActivePlayerID string
	Cursor         data.Position
	Units          []string
	Positions      map[string]data.Position
	Robots         map[string]data.Robot
	Tags           map[string]data.Tag
	Items          map[string]data.Item
	Pilots         map[string]data.Pilot
	Done           interface{}
}

type App struct {
	SeqID    int
	Money    int
	Gameplay Gameplay
	Lobby    Lobby
}

type DefaultModel struct {
	App   App
	Stack []App
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
		Title:   data.GameData.Weapon[protoID].Title,
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
		Title:   data.GameData.Component[protoID].Title,
	})
	return nil
}

func (v *DefaultModel) AssocRobotPilot(robotID string, pilotID string) error {
	fmt.Printf("AssocRobotPilot(%v, %v)\n", robotID, pilotID)
	v.App.Lobby.PilotIDByRobotID = data.AssocStringString(v.App.Lobby.PilotIDByRobotID, robotID, pilotID)
	fmt.Printf("XXXXX(%v)\n", v.App.Lobby.PilotIDByRobotID)
	return nil
}
func (v *DefaultModel) DissocRobotPilot(robotID string) error {
	fmt.Printf("DissocRobotPilot(%v)\n", robotID)
	v.App.Lobby.PilotIDByRobotID = data.DissocStringString(v.App.Lobby.PilotIDByRobotID, robotID)
	return nil
}
func (v *DefaultModel) AssocWeaponRobot(weaponID string, robotID string) error {
	fmt.Printf("AssocWeaponRobot(%v, %v)\n", robotID, weaponID)
	v.App.Lobby.RobotIDByWeaponID = data.AssocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID, robotID)
	return nil
}
func (v *DefaultModel) DissocWeaponRobot(weaponID string) error {
	fmt.Printf("DissocWeaponRobot(%v)\n", weaponID)
	v.App.Lobby.RobotIDByWeaponID = data.DissocStringString(v.App.Lobby.RobotIDByWeaponID, weaponID)
	return nil
}
func (v *DefaultModel) AssocComponentRobot(componentID string, robotID string) error {
	fmt.Printf("AssocComponentRobot(%v, %v)\n", robotID, componentID)
	v.App.Lobby.RobotIDByComponentID = data.AssocStringString(v.App.Lobby.RobotIDByComponentID, componentID, robotID)
	return nil
}
func (v *DefaultModel) DissocComponentRobot(componentID string) error {
	fmt.Printf("DissocComponentRobot(%v)\n", componentID)
	v.App.Lobby.RobotIDByComponentID = data.DissocStringString(v.App.Lobby.RobotIDByComponentID, componentID)
	return nil
}
func (v *DefaultModel) QueryActivePlayer() string {
	return data.PlayerIDPlayer
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
func (v *DefaultModel) QueryRobotCanBuy() map[string]data.RobotProto {
	return data.GameData.Robot
}
func (v *DefaultModel) QueryPilotCanBuy() map[string]data.PilotProto {
	return data.GameData.Pilot
}
func (v *DefaultModel) QueryWeaponCanBuy() map[string]data.WeaponProto {
	return data.GameData.Weapon
}
func (v *DefaultModel) QueryComponentCanBuy() map[string]data.ComponentProto {
	return data.GameData.Component
}

func (v *DefaultModel) QueryCursorInMap() data.Position {
	return data.Position{}
}
func (v *DefaultModel) QueryUnitsByRegion(p1 data.Position, p2 data.Position) []string {
	return nil
}
func (v *DefaultModel) QueryUnitByPosition(data.Position) string {
	return ""
}
func (v *DefaultModel) GetGameplayRobots() map[string]data.Robot {
	return nil
}
func (v *DefaultModel) GetGameplayItems() map[string]data.Item {
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

func (v *DefaultModel) SetCursor(cursor data.Position) {
	v.App.Gameplay.Cursor = cursor
}

func (v *DefaultModel) GetCursor() data.Position {
	return v.App.Gameplay.Cursor
}

var (
	defaultMap = [][]int{}
)

func init() {
	temp := [][]int{}
	i := 0
	for y := 0; y < 30; y++ {
		row := []int{}
		for x := 0; x < 30; x++ {
			row = append(row, i%4)
			i++
		}
		temp = append(temp, row)
	}
	defaultMap = temp
}

func (v *DefaultModel) GetMap() [][]int {
	return defaultMap
}
