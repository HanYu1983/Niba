package v1

import (
	"app/tool/data"
)

func (v *model) QueryActivePlayer() string {
	return data.PlayerIDPlayer
}
func (v *model) NextPlayer() error {
	return nil
}
func (v *model) IsDone() bool {
	return false
}
func (v *model) QueryCursorInMap() data.Position {
	return data.Position{}
}
func (v *model) QueryUnitsByRegion(p1 data.Position, p2 data.Position) []string {
	return SearchUnitByRegion(v.App.Gameplay.Positions, p1, p2)
}
func (v *model) QueryUnitByPosition(pos data.Position) string {
	return SearchUnitByPosition(v.App.Gameplay.Positions, pos)
}
func (v *model) GetGameplayRobots() map[string]data.Robot {
	return v.App.Gameplay.Robots
}
func (v *model) GetGameplayItems() map[string]data.Item {
	return v.App.Gameplay.Items
}
func (v *model) GetGameplayPositions() map[string]data.Position {
	return v.App.Gameplay.Positions
}
func (v *model) SetCursor(cursor data.Position) {
	v.App.Gameplay.Cursor = cursor
}
func (v *model) GetCursor() data.Position {
	return v.App.Gameplay.Cursor
}
func (v *model) GetMap() [][]int {
	return v.App.Gameplay.Map
}
