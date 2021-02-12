package helper

import (
	"app/tool"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
	"tool/astar"
)

func TerrainID2Terrain(originTerrainID int) (data.TerrainProto, error) {
	terrainMapping, has := data.GameData.TerrainMapping[strconv.Itoa(originTerrainID)]
	if has == false {
		return data.TerrainProto{}, fmt.Errorf("terrainMapping not found: %v %v", originTerrainID)
	}
	terrain, has := data.GameData.Terrain[terrainMapping.Terrain]
	if has == false {
		return data.TerrainProto{}, fmt.Errorf("data.GameData.Terrain not found: %v %v", terrainMapping.Terrain)
	}
	return terrain, nil
}

func QueryTerrain(gameMap [][]int, cache map[protocol.Position]data.TerrainProto, pos protocol.Position) (data.TerrainProto, error) {
	if terrain, has := cache[pos]; has {
		return terrain, nil
	}
	originTerrainID, err := tool.TryGetInt2(gameMap, pos[1])(pos[0], nil)
	if err != nil {
		return data.TerrainProto{}, err
	}
	terrain, err := TerrainID2Terrain(originTerrainID)
	if err != nil {
		return data.TerrainProto{}, err
	}
	cache[pos] = terrain
	return terrain, nil
}

func BasicExtentCell(v int) ([]protocol.Position, error) {
	tree, _ := astar.ShortedPathTree(
		protocol.Position{},
		func(curr *astar.Node) bool {
			return false
		},
		func(curr *astar.Node) []astar.NeighborsNode {
			// prevent infinite loop
			if int(curr.Cost) > 100 {
				return []astar.NeighborsNode{}
			}
			currPos := curr.Pather.(protocol.Position)
			offsets := []protocol.Position{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
			ret := []astar.NeighborsNode{}
			for _, offset := range offsets {
				x, y := currPos[0]+offset[0], currPos[1]+offset[1]
				nextPos := protocol.Position{x, y}
				nextCost := 1.0
				if int(curr.Cost+nextCost) > v {
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
	retPos := []protocol.Position{}
	for key := range tree {
		retPos = append(retPos, key.(protocol.Position))
	}
	return retPos, nil
}

func QueryMinMaxAttackRange(w int, h int, min int, max int, offset protocol.Position) ([]protocol.Position, error) {
	maxRange, err := BasicExtentCell(max)
	if err != nil {
		return []protocol.Position{}, err
	}
	ret := maxRange
	if min < max {
		minRange, err := BasicExtentCell(min)
		if err != nil {
			return []protocol.Position{}, err
		}
		ret = protocol.DifferencePosition(maxRange, minRange)
	}
	ret = protocol.DifferencePosition(ret, []protocol.Position{{0, 0}})
	for i, pos := range ret {
		x, y := pos[0]+offset[0], pos[1]+offset[1]
		if x < 0 || x >= w {
			continue
		}
		if y < 0 || y >= h {
			continue
		}
		ret[i] = protocol.Position{x, y}
	}
	return ret, nil
}
