package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
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
	terrainCache := map[data.Position]data.TerrainProto{}
	pos := v.App.Gameplay.Positions[robotID]
	movePower, err := QueryRobotMovePower(v.App, robotID)
	if err != nil {
		fmt.Println(err.Error())
		return []data.Position{}
	}
	tree, _ := astar.ShortedPathTree(
		pos,
		func(curr *astar.Node) bool {
			return false
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			if int(curr.Cost) > 100 {
				return []astar.NeighborsNode{}
			}
			currPos := curr.Pather.(data.Position)
			terrain1 := data.QueryTerrain(v.App.Gameplay.Map, terrainCache, currPos)
			offsets := []data.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
			ret := []astar.NeighborsNode{}
			for _, offset := range offsets {
				x, y := currPos[0]+offset[0], currPos[1]+offset[1]
				if x < 0 || x >= len(v.App.Gameplay.Map[0]) {
					continue
				}
				if y < 0 || y >= len(v.App.Gameplay.Map) {
					continue
				}
				nextPos := data.Position{x, y}
				terrain2 := data.QueryTerrain(v.App.Gameplay.Map, terrainCache, nextPos)
				nextCost := float64(terrain1.Cost + terrain2.Cost)
				if int(curr.Cost+nextCost) > movePower {
					continue
				}
				ret = append(ret, astar.NeighborsNode{
					Pather: nextPos,
					Cost:   nextCost,
				})
			}
			return ret
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
func (v *model) EnableRobotMenu(string, interface{}) error {
	v.App.Gameplay.RobotMenu.Active = true
	v.App.Gameplay.RobotMenu.Options = [][]string{{uidata.MenuOptionMove}, {"0", "1"}, {uidata.MenuOptionUnitDone}}
	v.App.Gameplay.RobotMenu.RowFunctionMapping = map[int]int{1: protocol.RobotMenuFunctionWeapon}
	v.App.Gameplay.RobotMenu.Weapons = map[string]data.Weapon{"0": {}, "1": {}}
	return nil
}
func (v *model) GetRobotMenu() protocol.RobotMenu {
	return v.App.Gameplay.RobotMenu
}
