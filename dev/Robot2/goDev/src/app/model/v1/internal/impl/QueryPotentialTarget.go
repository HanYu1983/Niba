package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/helper"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

type PotentailTarget struct {
	DesirePositions []protocol.Position
	DesireUnitID    string
	DesireTransform string
	DesireWeapon    protocol.Weapon
}

func QueryPotentialTarget(model types.Model, robot protocol.Robot, transform string, weapons protocol.Weapons) ([]PotentailTarget, error) {
	// 取得尋找區域
	selfPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
	if err != nil {
		return nil, err
	}
	leftTopPos := protocol.Position{selfPos[0] - 20, selfPos[1] - 20}
	rightBottomPos := protocol.Position{selfPos[0] + 20, selfPos[1] + 20}
	// 區域內的單位
	units := SearchUnitByRegion(model.App.Gameplay.Positions, leftTopPos, rightBottomPos)
	if err != nil {
		return nil, err
	}
	log.Log(protocol.LogCategoryDetail, "QueryPotentialTarget", fmt.Sprintf("units(%v)", units))
	// 篩選
	// 1. 機器人
	// 2. 非友好單位
	robots := map[string]protocol.Robot{}
	for _, unitID := range units {
		targetRobot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, unitID)
		if err != nil {
			return nil, err
		}
		isFriendly, err := IsFriendlyRobot(model, robot.ID, targetRobot.ID)
		if err != nil {
			return nil, err
		}
		if isFriendly {
			continue
		}
		robots[unitID] = targetRobot
	}
	log.Log(protocol.LogCategoryDetail, "QueryPotentialTarget", fmt.Sprintf("robots(%v)", robots))
	// 自身的移動範圍(範圍A)
	tree, err := QueryMoveRangeTree(model, robot.ID)
	if err != nil {
		return nil, err
	}
	selfMoveRange := helper.MoveRangeTree2MoveRange(tree)
	// 比對所有武器
	ret := []PotentailTarget{}
	for _, weapon := range weapons {
		// 武器攻擊範圍
		attackRange, err := common.QueryRobotWeaponAttackRange(model, robot, weapon, protocol.Position{})
		if err != nil {
			return nil, err
		}
		// 比對所有敵對象
		for _, robot := range robots {
			// 將自身的武器攻擊範圍以敵方位置為中心(範圍B)
			robotPos, err := protocol.TryGetStringPosition(model.App.Gameplay.Positions, robot.ID)
			if err != nil {
				return nil, err
			}
			attackRangeWithCenter := []protocol.Position{}
			for _, attackPos := range attackRange {
				attackPosWithCenter := protocol.Position{robotPos[0] + attackPos[0], robotPos[1] + attackPos[1]}
				attackRangeWithCenter = append(attackRangeWithCenter, attackPosWithCenter)
			}
			// 若範圍A和範圍B有交疊代表可以攻擊到
			overlayRange := protocol.IntersectionPosition(selfMoveRange, attackRangeWithCenter)
			log.Log(protocol.LogCategoryDetail, "QueryPotentialTarget", fmt.Sprintf("overlayRange(%v)", overlayRange))
			if len(overlayRange) == 0 {
				continue
			}
			ret = append(ret, PotentailTarget{
				DesirePositions: overlayRange,
				DesireUnitID:    robot.ID,
				DesireTransform: transform,
				DesireWeapon:    weapon,
			})
		}
	}
	return ret, nil
}
