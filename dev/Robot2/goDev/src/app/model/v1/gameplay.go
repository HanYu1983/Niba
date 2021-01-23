package v1

import (
	"app/tool/data"
	"tool/astar"
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
func (v *model) QueryMoveRange(robotID string) []data.Position {
	pos := v.App.Gameplay.Positions[robotID]
	tree, _ := astar.ShortedPathTree(
		pos,
		func(curr *astar.Node) bool {
			return false
		},
		func(curr *astar.Node) []interface{} {
			if curr.Cost > 3 {
				return []interface{}{}
			}
			currPos := curr.Pather.(data.Position)
			offsets := []data.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
			ret := []interface{}{}
			for _, offset := range offsets {
				x, y := currPos[0]+offset[0], currPos[1]+offset[1]
				if x < 0 || x >= len(v.App.Gameplay.Map[0]) {
					continue
				}
				if y < 0 || y >= len(v.App.Gameplay.Map) {
					continue
				}
				ret = append(ret, data.Position{x, y})
			}
			return ret
		},
		func(curr *astar.Node, neighbor interface{}) float64 {
			return 1
		},
		func(curr *astar.Node) float64 {
			return 1
		},
	)
	retPos := []data.Position{}
	for key := range tree {
		retPos = append(retPos, key.(data.Position))
	}
	return retPos
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
func (v *model) QueryMoveCount(string) int {
	return 1
}
func (v *model) RobotMove(string, data.Position) error {
	return nil
}
func (v *model) RobotTransform(string, string) error {
	return nil
}
func (v *model) RobotSkyGround(string) error {
	return nil
}
