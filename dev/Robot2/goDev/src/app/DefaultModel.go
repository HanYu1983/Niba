package app

import (
	"app/tool/data"
	"fmt"
)

type DefaultModel struct {
	ctx   data.App
	Stack []data.App
}

func (v *DefaultModel) Push() {
	v.Stack = append(v.Stack, v.ctx)
}
func (v *DefaultModel) Pop() {
	v.Stack = v.Stack[:len(v.Stack)-1]
}
func (v *DefaultModel) Reset() {
	top := v.Stack[len(v.Stack)-1]
	v.ctx = top
}
func (v *DefaultModel) BuyRobot(id string) error {
	fmt.Printf("BuyRobot(%v)\n", id)
	return nil
}
func (v *DefaultModel) BuyPilot(id string) error {
	fmt.Printf("BuyPilot(%v)\n", id)
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
