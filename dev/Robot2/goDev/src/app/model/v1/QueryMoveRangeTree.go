package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"tool/astar"
)

func QueryMoveRangeTree(v model, robotID string) (astar.NodeMap, error) {
	terrainCache := map[protocol.Position]data.TerrainProto{}
	pos := v.App.Gameplay.Positions[robotID]
	movePower, err := QueryRobotMovePower(v.App, robotID)
	if err != nil {
		return nil, err
	}
	tree, _ := astar.ShortedPathTree(
		pos,
		func(curr *astar.Node) bool {
			return false
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			// prevent infinite loop
			if int(curr.Cost) > 100 {
				return []astar.NeighborsNode{}
			}
			currPos := curr.Pather.(protocol.Position)
			terrain1 := helper.QueryTerrain(v.App.Gameplay.Map, terrainCache, currPos)
			offsets := []protocol.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
			ret := []astar.NeighborsNode{}
			for _, offset := range offsets {
				x, y := currPos[0]+offset[0], currPos[1]+offset[1]
				if x < 0 || x >= len(v.App.Gameplay.Map[0]) {
					continue
				}
				if y < 0 || y >= len(v.App.Gameplay.Map) {
					continue
				}
				nextPos := protocol.Position{x, y}
				terrain2 := helper.QueryTerrain(v.App.Gameplay.Map, terrainCache, nextPos)
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

	return tree, nil
}
