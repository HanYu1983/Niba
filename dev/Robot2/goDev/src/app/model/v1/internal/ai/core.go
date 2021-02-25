package ai

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/helper"
	"app/tool/protocol"
	"tool/log"
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

func QueryTeamCombatPower(origin types.Model, robotIDs []string) (int, error) {
	ctx := origin
	var totalCombatPower int
	for _, robotID := range robotIDs {
		robot, err := protocol.TryGetStringRobot(ctx.App.Gameplay.Robots, robotID)
		if err != nil {
			return 0, err
		}
		weapons, err := common.QueryRobotWeapons(ctx, robot.ID, robot.Transform)
		if err != nil {
			return 0, err
		}
		combatPower, err := common.QueryRobotCombatPower(ctx, robot, weapons)
		if err != nil {
			return 0, err
		}
		totalCombatPower += combatPower
	}
	return totalCombatPower, nil
}

func Strategy(origin types.Model, playerID string, myRobotIDs []string, targetRobotIDs []string) (types.Model, error) {
	var err error
	ctx := origin
	memory := ctx.App.Gameplay.AIModel.Memory[playerID]
	myTeams := mlkmeans.KMeansResult{}
	{
		clusters := memory.MyClusters
		robotIDs := myRobotIDs
		if len(robotIDs) == 0 {
			log.Log(protocol.LogCategoryWarning, "Strategy", "機體不存在, 無法分隊.")
		} else {
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
						if v.Size == 0 {
							continue
						}
						centroidV2 := v.Centroid
						centers = append(centers, []interface{}{
							centroidV2[0], centroidV2[1],
						})
					}
					if cnt == len(centers) {
						options["initialization"] = centers
					}
				}
			}
			myTeams, err = mlkmeans.KMeans(posData, cnt, options)
			if err != nil {
				return origin, err
			}
		}
	}
	targetTeams := mlkmeans.KMeansResult{}
	{
		clusters := memory.TargetClusters
		robotIDs := targetRobotIDs
		if len(robotIDs) == 0 {
			log.Log(protocol.LogCategoryWarning, "Strategy", "機體不存在, 無法分隊.")
		} else {
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
						if v.Size == 0 {
							continue
						}
						centroidV2 := v.Centroid
						centers = append(centers, []interface{}{
							centroidV2[0], centroidV2[1],
						})
					}
					if cnt == len(centers) {
						options["initialization"] = centers
					}
				}
			}
			targetTeams, err = mlkmeans.KMeans(posData, cnt, options)
			if err != nil {
				return origin, err
			}
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
	return ctx, nil
}
