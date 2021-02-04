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
	return Goal{Type: GoalTypeMoveToPosition, Position: protocol.Position{5, 5}}, nil
}

func RobotThinking(origin uidata.UI, robot protocol.Robot) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	ctx := origin
	view := def.View
	var noGoal Goal
	goal, err := QueryGoal(ctx.Model.(model), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
	case GoalTypeMoveToPosition:
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
			ctx, err = common.ObservePage(ctx, uidata.PageGameplay)
			if err != nil {
				return origin, false, err
			}
			view.Render(ctx)
		}
		ctx.Model, err = ctx.Model.RobotDone(robot.ID)
		if err != nil {
			return origin, false, err
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
