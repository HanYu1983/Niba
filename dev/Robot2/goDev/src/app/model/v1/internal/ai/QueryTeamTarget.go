package ai

import (
	"app/model/v1/internal/tool/types"
	"tool/nodejs/mlkmeans"
)

func QueryTeamTarget(origin types.Model, myRobotIDs []string, myTeams mlkmeans.KMeansResult, targetRobotIDs []string, targetTeams mlkmeans.KMeansResult) (map[int]int, bool, error) {
	ctx := origin
	myTeamCnt, err := QueryTeamCount(myTeams)
	if err != nil {
		return nil, false, err
	}
	targetTeamCnt, err := QueryTeamCount(targetTeams)
	if err != nil {
		return nil, false, err
	}
	if targetTeamCnt == 0 {
		return nil, false, nil
	}
	selectTargetTeamID := map[int]int{}
	{
		var currTargetTeamID int
		currTargetTeammate, err := QueryTeammate(targetTeams, targetRobotIDs, currTargetTeamID)
		if err != nil {
			return nil, false, err
		}
		currTargetTeamPower, err := QueryTeamCombatPower(ctx, currTargetTeammate)
		if err != nil {
			return nil, false, err
		}
		// 累積戰力
		var totalPower int
		// 我方每一隊
		for i := 0; i < myTeamCnt; i++ {
			// 指派目標
			// 基本上是第i隊打第i隊
			selectTargetTeamID[i] = currTargetTeamID
			// 隊員
			currMyTeammate, err := QueryTeammate(myTeams, myRobotIDs, i)
			if err != nil {
				return nil, false, err
			}
			// 隊戰力
			currMyTeamPower, err := QueryTeamCombatPower(ctx, currMyTeammate)
			if err != nil {
				return nil, false, err
			}
			// 累積戰力
			totalPower += currMyTeamPower
			// 若戰力小於對手, 跳過, 合併下一隊
			if totalPower < currTargetTeamPower {
				continue
			}
			// 若戰力大於對手
			// 清空累積戰力
			totalPower = 0
			// 下一個目標隊
			currTargetTeamID++
			// 目標隊伍用完, 離開
			if currTargetTeamID >= targetTeamCnt {
				break
			}
			// 重新計算新目標的資訊
			currTargetTeammate, err = QueryTeammate(targetTeams, targetRobotIDs, currTargetTeamID)
			if err != nil {
				return nil, false, err
			}
			currTargetTeamPower, err = QueryTeamCombatPower(ctx, currTargetTeammate)
			if err != nil {
				return nil, false, err
			}
		}
	}
	return selectTargetTeamID, true, nil
}
