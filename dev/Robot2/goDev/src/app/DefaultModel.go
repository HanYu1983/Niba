package app

import (
	"app/tool/data"
	"app/tool/uidata"
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
	})
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
func (v *DefaultModel) QueryGameInfo() uidata.GameInfo {
	return uidata.GameInfo{
		Money: v.App.Money,
	}
}
