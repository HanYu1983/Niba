package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func SelectRobotForTargetTerrain(terrain data.TerrainProto) (protocol.Robot, error) {
	switch terrain.ID {
	case "shallowSea", "deepSea":

	case "mountain", "plain", "forest", "road", "city", "beach", "award":

	default:
		return protocol.Robot{}, fmt.Errorf("unknown terrain(%v)\n", terrain.ID)
	}
	return protocol.Robot{}, nil
}

func GenerateLevel(model model, enemyCount int, clusterCount int, iteration int, force int) error {
	//gameMap := model.App.Gameplay.Map

	// count := map[data.TerrainProto]int{}
	// for _, row := range gameMap {
	// 	for _, id := range row {
	// 		terrain, err := helper.TerrainID2Terrain(id)
	// 		if err != nil {
	// 			return err
	// 		}
	// 		count[terrain]++
	// 	}
	// }
	// total := 0
	// for _, c := range count {
	// 	total += c
	// }
	// if total == 0 {
	// 	return fmt.Errorf("total must not 0")
	// }
	// for terrain, c := range count {
	// 	factor := c / total
	// 	robot, err := SelectRobotForTargetTerrain(terrain)
	// 	if err != nil {
	// 		return err
	// 	}
	// }
	return nil
}
