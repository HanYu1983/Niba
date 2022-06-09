package v1

import (
	"app/model/v1/internal/ai"
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"

	"github.com/go-gl/mathgl/mgl64"
)

func QueryGoal(model Model, robotID string) (types.Goal, error) {
	if goal, has := model.App.Gameplay.AIModel.GoalByRobotID[robotID]; has {
		return goal, nil
	}
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return types.Goal{}, err
	}
	memory := model.App.Gameplay.AIModel.Memory[robot.PlayerID]
	teamID, hasTeam := memory.TeamIDByRobotID[robotID]
	log.Log(protocol.LogCategoryDetail, "QueryGoal", fmt.Sprintf("robotID(%v) teamID(%v) hasTeam(%v)", robotID, teamID, hasTeam))
	if hasTeam {
		targetTeamID, hasTargetTeam := memory.MyTeamTarget[teamID]
		log.Log(protocol.LogCategoryDetail, "QueryGoal", fmt.Sprintf("robotID(%v) targetTeamID(%v) hasTargetTeam(%v)", robotID, targetTeamID, hasTargetTeam))
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

func OnRobotAttack(origin uidata.UI, robotID string, weaponID string, targetRobotID string) (uidata.UI, error) {
	var err error
	ctx := origin
	err = RenderRobotAim(ctx, robotID, targetRobotID)
	if err != nil {
		return origin, err
	}
	for {
		var cancel bool
		ctx, cancel, err = OnSingleBattleMenuPhase(ctx, false, robotID, weaponID, targetRobotID)
		if err != nil {
			return origin, err
		}
		// can not cancel
		if cancel {
			continue
		}
		break
	}
	return ctx, nil
}

func OnAIRobotMoveFirst(origin uidata.UI, robotID string, targetPosition protocol.Position) (uidata.UI, bool, error) {
	ctx := origin
	isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(types.Model(ctx.Model.(Model)), nil, robotID, targetPosition)
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryDetail, "OnAIRobotMoveFirst", fmt.Sprintf("isCanMove(%v) targetPosition(%v)", isCanMove, targetPosition))
	if isCanMove {
		ctx, err = OnRobotMove(ctx, robotID, tree, targetPosition)
		if err != nil {
			return origin, false, err
		}
	}
	robot, err := protocol.TryGetStringRobot(types.Model(ctx.Model.(Model)).App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, false, err
	}
	weapons, err := common.QueryRobotWeapons(types.Model(ctx.Model.(Model)), robotID, robot.Transform, true)
	if err != nil {
		return origin, false, err
	}
	// 取得有效武器
	invalidWeapons, err := common.CheckInvalidWeapons(types.Model(ctx.Model.(Model)), robotID, weapons, nil)
	if err != nil {
		return origin, false, err
	}
	weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
		_, isInvalid := invalidWeapons[weapon.ID]
		return isInvalid == false
	})
	potentails, err := impl.QueryPotentialTarget(types.Model(ctx.Model.(Model)), robot.ID, robot.Transform, weapons, false)
	if err != nil {
		return origin, false, err
	}
	if len(potentails) > 0 {
		potentail := potentails[len(potentails)-1]
		ctx, err = OnRobotAttack(ctx, robotID, potentail.DesireWeapon.ID, potentail.DesireUnitID)
		if err != nil {
			return origin, false, err
		}
	}
	return ctx, true, nil
}

func OnAIRobotAttackFirst(origin uidata.UI, robotID string) (uidata.UI, bool, error) {
	ctx := origin
	robot, err := protocol.TryGetStringRobot(types.Model(ctx.Model.(Model)).App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, false, err
	}
	weapons, err := common.QueryRobotWeapons(types.Model(ctx.Model.(Model)), robotID, robot.Transform, true)
	if err != nil {
		return origin, false, err
	}
	// 取得有效武器
	invalidWeapons, err := common.CheckInvalidWeapons(types.Model(ctx.Model.(Model)), robotID, weapons, nil)
	if err != nil {
		return origin, false, err
	}
	weapons = protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
		_, isInvalid := invalidWeapons[weapon.ID]
		if isInvalid {
			return false
		}
		return true
	})
	potentails, err := impl.QueryPotentialTarget(types.Model(ctx.Model.(Model)), robot.ID, robot.Transform, weapons, false)
	if err != nil {
		return origin, false, err
	}
	if len(potentails) > 0 {
		// 執行原地攻擊
		potentail := potentails[len(potentails)-1]
		ctx, err = OnRobotAttack(ctx, robotID, potentail.DesireWeapon.ID, potentail.DesireUnitID)
		if err != nil {
			return origin, false, err
		}
		return ctx, true, nil
	}
	// 可移動攻擊的武器
	weaponsCanMoveAttack := protocol.FilterStringWeapon(weapons, func(_ string, weapon protocol.Weapon) bool {
		ability, err := common.QueryRobotWeaponAbility(types.Model(ctx.Model.(Model)), robot.ID, weapon, true)
		if err != nil {
			fmt.Print(err.Error())
			return false
		}
		hasMoveAttack := len(tool.FilterString(ability, func(c string) bool {
			return c == "moveAttack"
		})) > 0
		if hasMoveAttack == false {
			return false
		}
		return true
	})
	potentails, err = impl.QueryPotentialTarget(types.Model(ctx.Model.(Model)), robot.ID, robot.Transform, weaponsCanMoveAttack, true)
	if err != nil {
		return origin, false, err
	}
	if len(potentails) > 0 {
		// 移動攻擊
		potentail := potentails[len(potentails)-1]
		targetPosition := potentail.DesirePositions[0]
		isCanMove, targetPosition, tree, err := impl.QueryFastestMovePosition(types.Model(ctx.Model.(Model)), nil, robotID, targetPosition)
		if err != nil {
			return origin, false, err
		}
		if isCanMove {
			ctx, err = OnRobotMove(ctx, robotID, tree, targetPosition)
			if err != nil {
				return origin, false, err
			}
		}
		ctx, err = OnRobotAttack(ctx, robotID, potentail.DesireWeapon.ID, potentail.DesireUnitID)
		if err != nil {
			return origin, false, err
		}
		return ctx, true, nil
	}
	return ctx, false, nil
}
func OnRobotThinking(origin uidata.UI, robotID string) (uidata.UI, bool, error) {
	var err error
	var cancel bool
	ctx := origin
	isRobotDone, err := common.IsRobotDone(types.Model(ctx.Model.(Model)), robotID)
	if err != nil {
		return origin, false, err
	}
	if isRobotDone {
		return origin, false, fmt.Errorf("[OnRobotThinking]robot(%v) already done.", robotID)
	}
	var noGoal types.Goal
	goal, err := QueryGoal(ctx.Model.(Model), robotID)
	if err != nil {
		return origin, false, err
	}
	log.Log(protocol.LogCategoryDetail, "OnRobotThinking", fmt.Sprintf("robotID(%v) goal(%+v)", robotID, goal))
	if goal == noGoal {
		return origin, false, nil
	}
	switch goal.Type {
	case types.GoalTypeSearchAndAttack:
		var success bool
		ctx, success, err = OnAIRobotAttackFirst(ctx, robotID)
		if err != nil {
			return origin, false, err
		}
		if success == false {
			targetPosition, find, err := common.QueryMostCloseEnemyPosition(types.Model(ctx.Model.(Model)), robotID)
			if find == false {
			}
			ctx, _, err = OnAIRobotMoveFirst(ctx, robotID, targetPosition)
			if err != nil {
				return origin, false, err
			}
		}
		ctx, err = OnRobotDone(ctx, robotID)
		if err != nil {
			return origin, false, err
		}
	case types.GoalTypeMoveToPosition:
		currPos := ctx.Model.(Model).App.Gameplay.Positions[robotID]
		var isArrive bool
		{
			currPosV2 := mgl64.Vec2{float64(currPos[0]), float64(currPos[1])}
			targetPosV2 := mgl64.Vec2{float64(goal.Position[0]), float64(goal.Position[1])}
			isArrive = targetPosV2.Sub(currPosV2).LenSqr() < 9
		}
		if isArrive {
			ctx, _, err = OnAIRobotAttackFirst(ctx, robotID)
			if err != nil {
				return origin, false, err
			}
		} else {
			ctx, _, err = OnAIRobotMoveFirst(ctx, robotID, goal.Position)
			if err != nil {
				return origin, false, err
			}
		}
		ctx, err = OnRobotDone(ctx, robotID)
		if err != nil {
			return origin, false, err
		}
	case types.GoalTypeAttackTargetRobot:
		ctx, cancel, err = OnSingleBattleMenuPhase(ctx, false, robotID, "weaponID", "targetID")
		if err != nil {
			return origin, false, err
		}
		if cancel {
			return origin, cancel, nil
		}
	default:
		return origin, false, fmt.Errorf("[OnRobotThinking] unknown goal(%v)", goal)
	}
	return ctx, false, nil
}

func OnEnemyTurnPhase(origin uidata.UI) (uidata.UI, bool, error) {
	log.Log(protocol.LogCategoryPhase, "OnEnemyTurnPhase", "start")
	var err error
	var cancel bool
	view := def.View
	ctx := origin
	ctx, err = OnCheckWinOrLose(ctx)
	if err != nil {
		return origin, false, err
	}
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
		if ctx.Model.State() == protocol.GameplayModelStateDone {
			if ctx.Model.StateReason() == nil {
				return origin, false, fmt.Errorf("State == GameplayModelStateDone. 但是StateReason是空值，請確認當設定為GameplayModelStateDone時, 一定要給StateReason")
			}
			break
		}
		isRobotDone, err := common.IsRobotDone(types.Model(ctx.Model.(Model)), robotID)
		if err != nil {
			return origin, false, err
		}
		if isRobotDone {
			continue
		}
		ctx, cancel, err = OnRobotThinking(ctx, robotID)
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
