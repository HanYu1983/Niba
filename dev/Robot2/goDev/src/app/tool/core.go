package tool

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
	"tool/log"
)

func Min(x, y int) int {
	if x < y {
		return x
	}
	return y
}

func Max(x, y int) int {
	if x > y {
		return x
	}
	return y
}

func Clamp(v int, min int, max int) (int, bool) {
	if v < min {
		return min, true
	}
	if v >= max {
		return max - 1, true
	}
	return v, false
}

func World2Local(camera protocol.Position, pos protocol.Position) protocol.Position {
	return protocol.Position{pos[0] - camera[0], pos[1] - camera[1]}
}

func Local2World(camera protocol.Position, pos protocol.Position) protocol.Position {
	return protocol.Position{pos[0] + camera[0], pos[1] + camera[1]}
}

func QueryTerrain(gameMap [][]int, cache map[protocol.Position]data.TerrainProto, pos protocol.Position) data.TerrainProto {
	if terrain, has := cache[pos]; has {
		return terrain
	}
	originTerrainID := gameMap[pos[1]][pos[0]]
	terrainMapping, has := data.GameData.TerrainMapping[strconv.Itoa(originTerrainID)]
	if has == false {
		log.Log(protocol.LogCategoryWarning, "QueryTerrain", fmt.Sprintf("terrainMapping not found: %v %v\n", originTerrainID, pos))
		return data.TerrainProto{}
	}
	terrain := data.GameData.Terrain[terrainMapping.Terrain]
	cache[pos] = terrain
	return terrain
}
