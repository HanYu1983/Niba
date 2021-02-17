package v1

import (
	"app/model/v1/internal/impl"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func QueryGoal(model Model, robotID string) (impl.Goal, error) {
	if goal, has := model.App.Gameplay.AIModel.Directive[robotID]; has {
		return goal, nil
	}
	return impl.Goal{Type: impl.GoalTypeSearchAndAttack, Position: protocol.Position{5, 5}}, nil
}

func RenderRobotAim(origin uidata.UI, fromRobot string, toRobot string) error {
	var err error
	ctx := origin
	view := def.View
	fromPos, err := protocol.TryGetStringPosition(impl.Model(ctx.Model.(Model)).App.Gameplay.Positions, fromRobot)
	if err != nil {
		return err
	}
	toPos, err := protocol.TryGetStringPosition(impl.Model(ctx.Model.(Model)).App.Gameplay.Positions, toRobot)
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
	isRobotDone, err := impl.IsRobotDone(impl.Model(ctx.Model.(Model)), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if isRobotDone {
		return origin, false, fmt.Errorf("[RobotThinking]robot(%v) already done.", robot.ID)
	}
	var noGoal impl.Goal
	goal, err := QueryGoal(ctx.Model.(Model), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
	case impl.GoalTypeSearchAndAttack:
		weapons, err := impl.QueryRobotWeapons(impl.Model(impl.Model(ctx.Model.(Model))), robot.ID, robot.Transform)
		if err != nil {
			return origin, false, err
		}
		// 取得有效武器
		// {
		// 	invalidWeapons, err := CheckInvalidWeapons(impl.Model(ctx.Model.(Model)), robot, weapons)
		// 	if err != nil {
		// 		return origin, false, err
		// 	}
		// 	weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
		// 		_, isInvalid := invalidWeapons[weapon.ID]
		// 		return isInvalid == false
		// 	})
		// }
		potentails, err := impl.QueryPotentialTarget(impl.Model(ctx.Model.(Model)), robot, robot.Transform, weapons)
		if err != nil {
			return origin, false, err
		}
		if len(potentails) > 0 {
			potentail := potentails[len(potentails)-1]
			isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(impl.Model(ctx.Model.(Model)), robot, potentail.DesirePositions[0])
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctx, err = OnRobotMove(ctx, robot.ID, tree, targetPosition)
				if err != nil {
					return origin, false, err
				}
			}
			err = RenderRobotAim(ctx, robot.ID, potentail.DesireUnitID)
			if err != nil {
				return origin, false, err
			}
			for {
				ctx, cancel, err = OnSingleBattleMenuPhase(ctx, false, robot.ID, potentail.DesireWeapon.ID, potentail.DesireUnitID)
				if err != nil {
					return origin, false, err
				}
				// can not cancel
				if cancel {
					continue
				}
				break
			}
			ctx, err = OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
		}
	case impl.GoalTypeMoveToPosition:
		currPos := ctx.Model.(Model).App.Gameplay.Positions[robot.ID]
		if currPos != goal.Position {
			isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(impl.Model(ctx.Model.(Model)), robot, goal.Position)
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctx, err = OnRobotMove(ctx, robot.ID, tree, targetPosition)
				if err != nil {
					return origin, false, err
				}
			}
			ctx, err = OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
		}
	case impl.GoalTypeAttackTargetRobot:
		ctx, cancel, err = OnSingleBattleMenuPhase(ctx, false, robot.ID, "weaponID", "targetID")
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
	robotIDs, err := impl.QueryUnitsByPlayer(impl.Model(ctx.Model.(Model)), activePlayer)
	if err != nil {
		return origin, false, err
	}
	for _, robotID := range robotIDs {
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		isRobotDone, err := impl.IsRobotDone(impl.Model(ctx.Model.(Model)), robotID)
		if err != nil {
			return origin, false, err
		}
		if isRobotDone {
			continue
		}
		robot, err := protocol.TryGetStringRobot(impl.Model(ctx.Model.(Model)).App.Gameplay.Robots, robotID)
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
