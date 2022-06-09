package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
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

func GenerateLevel(origin types.Model, playerID string) (types.Model, error) {
	ctx := origin
	if ctx.App.Gameplay.Map == nil {
		return origin, fmt.Errorf("ctx.App.Gameplay.Map not found")
	}
	mapW, mapH := len(ctx.App.Gameplay.Map[0]), len(ctx.App.Gameplay.Map)
	posList, err := GenerateCluster(mapW, mapH, 10, 2, 2)
	if err != nil {
		return origin, err
	}
	//gameMap := ctx.App.Gameplay.Map
	for _, pos := range posList {
		var pilot protocol.Pilot
		ctx, pilot, err = common.NewPilot(ctx, protocol.Pilot{
			ProtoID: "amuro",
		})
		ctx, _, err = common.NewRobot(ctx, protocol.Position(pos), protocol.Robot{
			ProtoID:  "gundam",
			PlayerID: playerID,
			PilotID:  pilot.ID,
		})
		if err != nil {
			return origin, err
		}
	}
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
	return ctx, nil
}
