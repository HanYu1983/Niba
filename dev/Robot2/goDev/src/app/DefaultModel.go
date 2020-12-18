package app

import (
	"app/tool/data"
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
	return nil
}
func (v *DefaultModel) BuyPilot(id string) error {
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
