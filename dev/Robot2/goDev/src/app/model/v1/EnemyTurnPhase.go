package v1

import (
	"app/page/common"
	"app/tool/def"
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

func RenderRobotAim(origin uidata.UI, fromRobot string, toRobot string) error {
	var err error
	ctx := origin
	view := def.View
	fromPos, err := protocol.TryGetStringPosition(ctx.Model.(model).App.Gameplay.Positions, fromRobot)
	if err != nil {
		return err
	}
	toPos, err := protocol.TryGetStringPosition(ctx.Model.(model).App.Gameplay.Positions, toRobot)
	if err != nil {
		return err
	}
	view.RenderRobotBattle(ctx, protocol.BattleResult{
		Animations: []protocol.BattleAnimation{
			{
				Type:        protocol.BattleResultTypeAim,
				AimPosition: [2]protocol.Position{fromPos, toPos},
			},
		},
	})
	return nil
}

func RobotThinking(origin uidata.UI, robot protocol.Robot) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	ctx := origin
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
		// @TODO: check invalid weapon
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
				ctxObj, err := ctx.Model.OnRobotMove(ctx, robot.ID, tree, targetPosition)
				if err != nil {
					return origin, false, err
				}
				ctx = ctxObj.(uidata.UI)
			}
			err = RenderRobotAim(ctx, robot.ID, potentail.DesireUnitID)
			if err != nil {
				return origin, false, err
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
			ctxObj, err := ctx.Model.OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
		}
	case GoalTypeMoveToPosition:
		currPos := ctx.Model.(model).App.Gameplay.Positions[robot.ID]
		if currPos != goal.Position {
			isCanMove, targetPosition, tree, err := QueryFastestMovePosition(ctx.Model.(model), robot, goal.Position)
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctxObj, err := ctx.Model.OnRobotMove(ctx, robot.ID, tree, targetPosition)
				if err != nil {
					return origin, false, err
				}
				ctx = ctxObj.(uidata.UI)
			}
			ctxObj, err := ctx.Model.OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
			ctx = ctxObj.(uidata.UI)
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
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
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
