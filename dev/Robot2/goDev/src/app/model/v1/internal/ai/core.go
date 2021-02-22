package ai

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/protocol"
	"fmt"
	"tool/nodejs/mlkmeans"
)

const (
	ClusterCnt = 4
)

func QueryTeamID(result mlkmeans.KMeansResult, robotIDs []string, robotID string) (int, error) {
	idx := tool.FindStringIndex(robotIDs, robotID)
	if idx == -1 {
		return 0, fmt.Errorf("robotID(%v) not exist in list(%v)", robotID, robotIDs)
	}
	return result.Clusters[idx], nil
}

func QueryTeammate(result mlkmeans.KMeansResult, robotIDs []string, teamID int) ([]string, error) {
	ret := []string{}
	for i, currTeamID := range result.Clusters {
		if currTeamID != teamID {
			continue
		}
		robotID, err := tool.TryGetString(robotIDs, i)
		if err != nil {
			return nil, err
		}
		ret = append(ret, robotID)
	}
	return ret, nil
}

func QueryTeamCount(result mlkmeans.KMeansResult) (int, error) {
	return len(result.Clusters), nil
}

func QueryTeamPower(origin types.Model, robotIDs []string) (int, error) {
	return 0, nil
}

func Strategy(origin types.Model, playerID string, robots []string) (types.Model, error) {
	ctx := origin
	//var centers []interface{}

	memory := ctx.App.Gameplay.AIModel.Memory[playerID]

	// posData := [][]interface{}{}
	// for _, robotID := range robots {
	// 	pos, err := protocol.TryGetStringPosition(ctx.App.Gameplay.Positions, robotID)
	// 	if err != nil {
	// 		return origin, err
	// 	}
	// 	posData = append(posData, []interface{}{pos[0], pos[1]})
	// }
	// cnt := helper.Max(len(robots), 4)
	// result, err := mlkmeans.KMeans(posData, cnt, map[string]interface{}{})
	// if err != nil {
	// 	return origin, err
	// }
	myRobotIDs := robots
	targetRobotIDs, err := common.QueryUnitsByPlayer(ctx, protocol.PlayerIDPlayer)
	if err != nil {
		return origin, err
	}
	myTeams := mlkmeans.KMeansResult{}
	targetTeams := mlkmeans.KMeansResult{}
	selectTargetTeamID, _, err := QueryTeamTarget(ctx, myRobotIDs, myTeams, targetRobotIDs, targetTeams)
	if err != nil {
		return origin, err
	}
	memory.MyTeamTarget = selectTargetTeamID
	memory.MyClusters = myTeams
	memory.TargetClusters = targetTeams

	ctx.App.Gameplay.AIModel.Memory = types.AssocStringMemory(ctx.App.Gameplay.AIModel.Memory, playerID, memory)
	fmt.Println(memory)
	return ctx, nil
}
