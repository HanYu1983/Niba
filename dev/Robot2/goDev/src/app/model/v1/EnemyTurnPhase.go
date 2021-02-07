package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

const (
	RoleTeamLeader = iota
	RoleTeamMember
)

type Team struct {
	Leader string
	Member map[string]bool
}

const (
	GoalTypeAttackTargetRobot = "GoalTypeAttackTargetRobot"
	GoalTypeMoveToPosition    = "GoalTypeMoveToPosition"
	GoalTypeSearchAndAttack   = "GoalTypeSearchAndAttack"
)

type Goal struct {
	Type     string
	RobotID  string
	Position protocol.Position
}

type AIModel struct {
	Directive map[string]Goal
}

func QueryGoal(model model, robotID string) (Goal, error) {
	if goal, has := model.App.Gameplay.AIModel.Directive[robotID]; has {
		return goal, nil
	}
	return Goal{Type: GoalTypeSearchAndAttack, Position: protocol.Position{5, 5}}, nil
}

type PotentailTarget struct {
	DesirePositions []protocol.Position
	DesireUnitID    string
	DesireTransform string
	DesireWeapon    protocol.Weapon
}

func QueryPotentialTarget(model model, robot protocol.Robot, transform string, weapons protocol.Weapons) ([]PotentailTarget, error) {
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
	tree, err := model.QueryMoveRangeTree(robot.ID)
	if err != nil {
		return nil, err
	}
	selfMoveRange := helper.MoveRangeTree2MoveRange(tree)
	// 比對所有武器
	ret := []PotentailTarget{}
	for _, weapon := range weapons {
		// 武器攻擊範圍
		attackRange, err := QueryRobotWeaponAttackRange(model, robot, weapon, protocol.Position{})
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

func RobotThinking(origin uidata.UI, robot protocol.Robot) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	ctx := origin
	view := def.View
	isRobotDone, err := IsRobotDone(ctx.Model.(model), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if isRobotDone {
		return origin, false, fmt.Errorf("[RobotThinking]robot(%v) already done.", robot.ID)
	}
	var noGoal Goal
	goal, err := QueryGoal(ctx.Model.(model), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
	case GoalTypeSearchAndAttack:
		weapons, err := QueryRobotWeapons(ctx.Model.(model), robot.ID, robot.Transform)
		if err != nil {
			return origin, false, err
		}
		potentails, err := QueryPotentialTarget(ctx.Model.(model), robot, robot.Transform, weapons)
		if err != nil {
			return origin, false, err
		}
		if len(potentails) > 0 {
			potentail := potentails[len(potentails)-1]
			isCanMove, targetPosition, tree, err := QueryFastestMovePosition(ctx.Model.(model), robot, potentail.DesirePositions[0])
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctx.Model, err = ctx.Model.RobotMove(robot.ID, targetPosition)
				if err != nil {
					return origin, false, err
				}
				view.RenderRobotMove(ctx, robot.ID, helper.MoveRangeTree2Path(tree, targetPosition))
				ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
				if err != nil {
					return origin, false, err
				}
				view.Render(ctx)
			}
			for {
				ctx, cancel, err = common.BattleMenuPhase(ctx, false, robot.ID, potentail.DesireWeapon.ID, potentail.DesireUnitID)
				if err != nil {
					return origin, false, err
				}
				// can not cancel
				if cancel {
					continue
				}
				break
			}
			ctx.Model, err = ctx.Model.RobotDone(robot.ID)
			if err != nil {
				return origin, false, err
			}
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
		}
	case GoalTypeMoveToPosition:
		currPos := ctx.Model.(model).App.Gameplay.Positions[robot.ID]
		if currPos != goal.Position {
			isCanMove, targetPosition, tree, err := QueryFastestMovePosition(ctx.Model.(model), robot, goal.Position)
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctx.Model, err = ctx.Model.RobotMove(robot.ID, targetPosition)
				if err != nil {
					return origin, false, err
				}
				view.RenderRobotMove(ctx, robot.ID, helper.MoveRangeTree2Path(tree, targetPosition))
			}
			ctx.Model, err = ctx.Model.RobotDone(robot.ID)
			if err != nil {
				return origin, false, err
			}
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
		}
	case GoalTypeAttackTargetRobot:
		ctx, cancel, err = common.BattleMenuPhase(ctx, false, robot.ID, "weaponID", "targetID")
		if err != nil {
			return origin, false, err
		}
		if cancel {
			return origin, cancel, nil
		}
	default:
		return origin, false, fmt.Errorf("[RobotThinking] unknown goal(%v)", goal)
	}
	return ctx, false, nil
}

func EnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "EnemyTurnPhase", "start")
	var err error
	var cancel bool
	view := def.View
	ctx := origin
	activePlayer, err := ctx.Model.QueryActivePlayer()
	if err != nil {
		return origin, false, err
	}
	robotIDs, err := QueryUnitsByPlayer(ctx.Model.(model), activePlayer)
	if err != nil {
		return origin, false, err
	}
	for _, robotID := range robotIDs {
		ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
		if err != nil {
			return origin, false, err
		}
		view.Render(ctx)
		isRobotDone, err := IsRobotDone(ctx.Model.(model), robotID)
		if err != nil {
			return origin, false, err
		}
		if isRobotDone {
			continue
		}
		robot, err := protocol.TryGetStringRobot(ctx.Model.(model).App.Gameplay.Robots, robotID)
		if err != nil {
			return origin, false, err
		}
		ctx, cancel, err = RobotThinking(ctx, robot)
		if err != nil {
			return origin, false, err
		}
		if cancel {
			return origin, cancel, nil
		}
	}
	log.Log(protocol.LogCategoryPhase, "EnemyTurnPhase", "end")
	var _ = view
	return ctx, false, nil
}
