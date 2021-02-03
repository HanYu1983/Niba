package v1

import (
	"app/page/common"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
)

const (
	RoleTeamLeader = iota
	RoleTeamMember
)

type Team struct {
	Leader string
	Member map[string]bool
}

type IAIEnvironment interface {
	QueryRobotsBelongPlayer(player string) (map[string]protocol.Robot, error)
}

const (
	GoalTypeAttackTargetRobot = "GoalTypeAttackTargetRobot"
)

type Goal struct {
	Type    string
	RobotID string
}

type AIModel struct {
	Directive map[string]Goal
}

func QueryGoal(model model, robotID string) (Goal, error) {
	return model.App.Gameplay.AIModel.Directive[robotID], nil
}

func RobotThinking(origin uidata.UI, robot protocol.Robot) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	view := def.View
	ctx := origin
	var noGoal Goal
	goal, err := QueryGoal(ctx.Model.(model), robot.ID)
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
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
	var _ = view
	return origin, false, nil
}

func EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	var err error
	var cancel bool
	view := def.View
	ctx := origin.(uidata.UI)
	activePlayer := ctx.Model.QueryActivePlayer()
	robots, err := ctx.Model.(IAIEnvironment).QueryRobotsBelongPlayer(activePlayer)
	if err != nil {
		return origin, false, err
	}
	for _, robot := range robots {
		ctx, cancel, err = RobotThinking(ctx, robot)
		if err != nil {
			return origin, false, err
		}
		if cancel {
			return origin, cancel, nil
		}
	}
	var _ = view
	return ctx, false, nil
}
