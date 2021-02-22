package ai

import (
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/nodejs/mlkmeans"
)

const (
	ClusterCnt = 4
)

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

func Strategy(origin types.Model, playerID string, myRobotIDs []string, targetRobotIDs []string) (types.Model, error) {
	var err error
	ctx := origin
	memory := ctx.App.Gameplay.AIModel.Memory[playerID]
	myTeams := mlkmeans.KMeansResult{}
	{
		clusters := memory.MyClusters
		robotIDs := myRobotIDs
		posData := [][]interface{}{}
		for _, robotID := range robotIDs {
			pos, err := protocol.TryGetStringPosition(ctx.App.Gameplay.Positions, robotID)
			if err != nil {
				return origin, err
			}
			posData = append(posData, []interface{}{pos[0], pos[1]})
		}
		cnt := helper.Min(len(robotIDs), 4)
		options := map[string]interface{}{}
		{
			centers := [][]interface{}{}
			if len(clusters.Centroids) > 0 {
				for _, v := range clusters.Centroids {
					centroidV2 := v.Centroid
					centers = append(centers, []interface{}{
						centroidV2[0], centroidV2[1],
					})
				}
				options["initialization"] = centers
			}
		}
		myTeams, err = mlkmeans.KMeans(posData, cnt, options)
		if err != nil {
			return origin, err
		}
	}
	targetTeams := mlkmeans.KMeansResult{}
	{
		clusters := memory.TargetClusters
		robotIDs := targetRobotIDs
		posData := [][]interface{}{}
		for _, robotID := range robotIDs {
			pos, err := protocol.TryGetStringPosition(ctx.App.Gameplay.Positions, robotID)
			if err != nil {
				return origin, err
			}
			posData = append(posData, []interface{}{pos[0], pos[1]})
		}
		cnt := helper.Min(len(robotIDs), 4)
		options := map[string]interface{}{}
		{
			centers := [][]interface{}{}
			if len(clusters.Centroids) > 0 {
				for _, v := range clusters.Centroids {
					centroidV2 := v.Centroid
					centers = append(centers, []interface{}{
						centroidV2[0], centroidV2[1],
					})
				}
				options["initialization"] = centers
			}
		}
		targetTeams, err = mlkmeans.KMeans(posData, cnt, options)
		if err != nil {
			return origin, err
		}
	}
	myRobotTeamID := map[string]int{}
	for i, robotID := range myRobotIDs {
		myRobotTeamID[robotID] = myTeams.Clusters[i]
	}

	selectTargetTeamID, _, err := QueryTeamTarget(ctx, myRobotIDs, myTeams, targetRobotIDs, targetTeams)
	if err != nil {
		return origin, err
	}
	memory.MyTeamTarget = selectTargetTeamID
	memory.MyClusters = myTeams
	memory.TargetClusters = targetTeams
	memory.TeamIDByRobotID = myRobotTeamID
	ctx.App.Gameplay.AIModel.Memory = types.AssocStringMemory(ctx.App.Gameplay.AIModel.Memory, playerID, memory)
	fmt.Println(memory)
	return ctx, nil
}
