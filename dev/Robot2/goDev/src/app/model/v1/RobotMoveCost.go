package v1

import (
	"app/tool/data"
	"app/tool/helper"
	"app/tool/protocol"
	"tool/astar"
)

var (
	terrainCache = map[protocol.Position]data.TerrainProto{}
)

func RobotMoveCost(model model, robot protocol.Robot) (func(curr *astar.Node) []astar.NeighborsNode, error) {
	movePower, err := QueryRobotMovePower(model.App, robot.ID)
	if err != nil {
		return func(curr *astar.Node) []astar.NeighborsNode {
			return nil
		}, err
	}
	return func(curr *astar.Node) []astar.NeighborsNode {
		// prevent infinite loop
		if int(curr.Cost) > 100 {
			return []astar.NeighborsNode{}
		}
		currPos := curr.Pather.(protocol.Position)
		terrain1 := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, currPos)
		offsets := []protocol.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
		ret := []astar.NeighborsNode{}
		for _, offset := range offsets {
			x, y := currPos[0]+offset[0], currPos[1]+offset[1]
			if x < 0 || x >= len(model.App.Gameplay.Map[0]) {
				continue
			}
			if y < 0 || y >= len(model.App.Gameplay.Map) {
				continue
			}
			nextPos := protocol.Position{x, y}
			terrain2 := helper.QueryTerrain(model.App.Gameplay.Map, terrainCache, nextPos)
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
	}, nil
}