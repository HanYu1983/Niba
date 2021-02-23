package v1

import (
	"app/model/v1/internal/ai"
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func QueryGoal(model Model, robot protocol.Robot) (types.Goal, error) {
	if goal, has := model.App.Gameplay.AIModel.GoalByRobotID[robot.ID]; has {
		return goal, nil
	}
	memory := model.App.Gameplay.AIModel.Memory[robot.PlayerID]
	teamID, hasTeam := memory.TeamIDByRobotID[robot.ID]
	log.Log(protocol.LogCategoryDetail, "QueryGoal", fmt.Sprintf("robotID(%v) teamID(%v) hasTeam(%v)", robot.ID, teamID, hasTeam))
	if hasTeam {
		targetTeamID, hasTargetTeam := memory.MyTeamTarget[teamID]
		log.Log(protocol.LogCategoryDetail, "QueryGoal", fmt.Sprintf("robotID(%v) targetTeamID(%v) hasTargetTeam(%v)", robot.ID, targetTeamID, hasTargetTeam))
		if hasTargetTeam {
			if targetTeamID >= len(memory.TargetClusters.Clusters) {
				return types.Goal{}, fmt.Errorf("targetTeamID not found in clusters")
			}
			// 目標隊的機體已清空
			if memory.TargetClusters.Centroids[targetTeamID].Size == 0 {
				return types.Goal{Type: types.GoalTypeSearchAndAttack, Position: protocol.Position{}}, nil
			}
			// 目標隊存在機體, 移向目標隊
			centroidV2 := memory.TargetClusters.Centroids[targetTeamID].Centroid
			centroid := protocol.Position{int(centroidV2[0]), int(centroidV2[1])}
			log.Log(protocol.LogCategoryDetail, "QueryGoal", fmt.Sprintf("centroid(%v)", centroid))
			return types.Goal{Type: types.GoalTypeMoveToPosition, Position: centroid}, nil
		}
	}
	return types.Goal{Type: types.GoalTypeSearchAndAttack, Position: protocol.Position{0, 0}}, nil
}

func RenderRobotAim(origin uidata.UI, fromRobot string, toRobot string) error {
	var err error
	ctx := origin
	view := def.View
	fromPos, err := protocol.TryGetStringPosition(types.Model(ctx.Model.(Model)).App.Gameplay.Positions, fromRobot)
	if err != nil {
		return err
	}
	toPos, err := protocol.TryGetStringPosition(types.Model(ctx.Model.(Model)).App.Gameplay.Positions, toRobot)
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
	isRobotDone, err := common.IsRobotDone(types.Model(ctx.Model.(Model)), robot.ID)
	if err != nil {
		return origin, false, err
	}
	if isRobotDone {
		return origin, false, fmt.Errorf("[RobotThinking]robot(%v) already done.", robot.ID)
	}
	var noGoal types.Goal
	goal, err := QueryGoal(ctx.Model.(Model), robot)
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryDetail, "RobotThinking", fmt.Sprintf("robotID(%v) goal(%+v)", robot.ID, goal))
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
	case types.GoalTypeSearchAndAttack:
		weapons, err := common.QueryRobotWeapons(types.Model(types.Model(ctx.Model.(Model))), robot.ID, robot.Transform)
		if err != nil {
			return origin, false, err
		}
		// 取得有效武器
		{
			invalidWeapons, err := impl.CheckInvalidWeapons(types.Model(ctx.Model.(Model)), robot, weapons, nil)
			if err != nil {
				return origin, false, err
			}
			weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				_, isInvalid := invalidWeapons[weapon.ID]
				return isInvalid == false
			})
		}
		potentails, err := impl.QueryPotentialTarget(types.Model(ctx.Model.(Model)), robot, robot.Transform, weapons, true)
		if err != nil {
			return origin, false, err
		}
		log.Log(protocol.LogCategoryDetail, "RobotThinking", fmt.Sprintf("potentails.len(%v)", len(potentails)))
		if len(potentails) > 0 {
			potentail := potentails[len(potentails)-1]
			isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(types.Model(ctx.Model.(Model)), nil, robot, potentail.DesirePositions[0])
			if err != nil {
				return origin, false, err
			}
			log.Log(protocol.LogCategoryDetail, "RobotThinking", fmt.Sprintf("isCanMove(%v) targetPosition(%v)", isCanMove, targetPosition))
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
		} else {
			targetPosition, find, err := common.QueryMostCloseEnemyPosition(types.Model(ctx.Model.(Model)), robot.ID)
			if err != nil {
				return origin, false, err
			}
			log.Log(protocol.LogCategoryDetail, "RobotThinking", fmt.Sprintf("QueryMostCloseEnemyPosition() targetPosition(%v) find(%v)", targetPosition, find))
			if find {
				isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(types.Model(ctx.Model.(Model)), nil, robot, targetPosition)
				if err != nil {
					return origin, false, err
				}
				log.Log(protocol.LogCategoryDetail, "RobotThinking", fmt.Sprintf("isCanMove(%v) targetPosition(%v)", isCanMove, targetPosition))
				if isCanMove {
					ctx, err = OnRobotMove(ctx, robot.ID, tree, targetPosition)
					if err != nil {
						return origin, false, err
					}
				}
			}
			ctx, err = OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
		}
	case types.GoalTypeMoveToPosition:
		currPos := ctx.Model.(Model).App.Gameplay.Positions[robot.ID]
		if currPos != goal.Position {
			weapons, err := common.QueryRobotWeapons(types.Model(ctx.Model.(Model)), robot.ID, robot.Transform)
			if err != nil {
				return origin, false, err
			}
			// 取得有效武器
			{
				invalidWeapons, err := impl.CheckInvalidWeapons(types.Model(ctx.Model.(Model)), robot, weapons, nil)
				if err != nil {
					return origin, false, err
				}
				weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
					_, isInvalid := invalidWeapons[weapon.ID]
					return isInvalid == false
				})
			}
			isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(types.Model(ctx.Model.(Model)), nil, robot, goal.Position)
			if err != nil {
				return origin, false, err
			}
			if isCanMove {
				ctx, err = OnRobotMove(ctx, robot.ID, tree, targetPosition)
				if err != nil {
					return origin, false, err
				}
				// 重新篩選可移動攻擊的武器
				// weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
				// 	ability, err := common.QueryRobotWeaponAbility(types.Model(ctx.Model.(Model)), robot, weapon)
				// 	if err != nil {
				// 		fmt.Println(err.Error())
				// 		return false
				// 	}
				// 	hasMoveAttack := len(tool.FilterString(ability, func(c string) bool {
				// 		return c == "moveAttack"
				// 	})) > 0
				// 	return hasMoveAttack == true
				// })
				// 取得有效武器
				{
					invalidWeapons, err := impl.CheckInvalidWeapons(types.Model(ctx.Model.(Model)), robot, weapons, nil)
					if err != nil {
						return origin, false, err
					}
					weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
						_, isInvalid := invalidWeapons[weapon.ID]
						return isInvalid == false
					})
				}
			}
			potentails, err := impl.QueryPotentialTarget(types.Model(ctx.Model.(Model)), robot, robot.Transform, weapons, false)
			if err != nil {
				return origin, false, err
			}
			if len(potentails) > 0 {
				potentail := potentails[len(potentails)-1]
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
			}
			ctx, err = OnRobotDone(ctx, robot.ID)
			if err != nil {
				return origin, false, err
			}
		}

	case types.GoalTypeAttackTargetRobot:
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

func OnEnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "OnEnemyTurnPhase", "start")
	var err error
	var cancel bool
	view := def.View
	ctx := origin
	activePlayer, err := ctx.Model.QueryActivePlayer()
	if err != nil {
		return origin, false, err
	}
	robotIDs, err := common.QueryUnitsByPlayer(types.Model(ctx.Model.(Model)), activePlayer.ID)
	if err != nil {
		return origin, false, err
	}
	{
		targetRobotIDs, err := common.QueryUnitsByPlayer(types.Model(ctx.Model.(Model)), protocol.PlayerIDPlayer)
		if err != nil {
			return origin, false, err
		}
		_model := types.Model(ctx.Model.(Model))
		_model, err = ai.Strategy(_model, activePlayer.ID, robotIDs, targetRobotIDs)
		if err != nil {
			return origin, false, err
		}
		ctx.Model = Model(_model)
	}
	for _, robotID := range robotIDs {
		ctx, err = view.Render(ctx)
		if err != nil {
			return origin, false, err
		}
		isRobotDone, err := common.IsRobotDone(types.Model(ctx.Model.(Model)), robotID)
		if err != nil {
			return origin, false, err
		}
		if isRobotDone {
			continue
		}
		robot, err := protocol.TryGetStringRobot(types.Model(ctx.Model.(Model)).App.Gameplay.Robots, robotID)
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
	log.Log(protocol.LogCategoryPhase, "OnEnemyTurnPhase", "end")
	var _ = view
	return ctx, false, nil
}
