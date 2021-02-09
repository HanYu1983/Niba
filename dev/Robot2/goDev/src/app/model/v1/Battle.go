package v1

import (
	"app/tool/helper"
	"app/tool/protocol"
	"math/rand"
)

func Battle(origin model, robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (model, protocol.BattleResult, error) {
	ctx := origin
	robot, err := protocol.TryGetStringRobot(ctx.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPilot, err := protocol.TryGetStringPilot(ctx.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotWeapons, err := QueryRobotWeapons(ctx, robot.ID, robot.Transform)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotWeapon, err := protocol.TryGetStringWeapon(robotWeapons, weaponID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPos, err := protocol.TryGetStringPosition(ctx.App.Gameplay.Positions, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobot, err := protocol.TryGetStringRobot(ctx.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotPilot, err := protocol.TryGetStringPilot(ctx.App.Gameplay.Pilots, targetRobot.PilotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotWeapons, err := QueryRobotWeapons(ctx, targetRobot.ID, targetRobot.Transform)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotPos, err := protocol.TryGetStringPosition(ctx.App.Gameplay.Positions, targetRobotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	results := []protocol.BattleAnimation{}
	// 先進行攻擊方
	// 消費彈藥
	results = append(results, protocol.BattleAnimation{
		Type:        protocol.BattleResultTypeWeapon,
		RobotBefore: robot,
		RobotAfter:  robot,
		Damage:      0,
		Positions: map[string]protocol.Position{
			robot.ID: robotPos,
		},
	})
	// 命中率
	hitRate, err := QueryBattleHitRate(ctx, robot, robotPilot, robotWeapon, targetRobot, targetRobotPilot)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	// 若對方使用閃避, 命中減半
	switch targetAction {
	case protocol.BattleMenuActionEvade:
		hitRate /= 2
	}
	isHit := rand.Float64() < hitRate
	if isHit {
		// 傷害動畫
		animationType := protocol.BattleResultTypeDamage
		// 命中
		damage, err := QueryBattleDamage(ctx, robot, robotPilot, robotWeapon, targetRobot, targetRobotPilot)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		// 若對方使用防守, 傷害減半
		isGuardAction := targetAction == protocol.BattleMenuActionGuard
		if isGuardAction {
			damage /= 2
			// 防守動畫
			animationType = protocol.BattleResultTypeGuard
		}
		targetRobotAfter := targetRobot
		targetRobotAfter.HP = helper.Max(0, targetRobot.HP-damage)
		// damage
		results = append(results, protocol.BattleAnimation{
			Type:        animationType,
			RobotBefore: targetRobot,
			RobotAfter:  targetRobotAfter,
			Damage:      damage,
			Positions: map[string]protocol.Position{
				targetRobot.ID: targetRobotPos,
			},
		})
		targetRobot = targetRobotAfter
	} else {
		// 被閃
		results = append(results, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeEvade,
			RobotBefore: targetRobot,
			RobotAfter:  targetRobot,
			Positions: map[string]protocol.Position{
				targetRobot.ID: targetRobotPos,
			},
		})
	}
	// 再進行防守方
	switch targetAction {
	case protocol.BattleMenuActionAttack:
		// aim
		results = append(results, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeAim,
			AimPosition: [2]protocol.Position{targetRobotPos, robotPos},
		})
		// counter
		results = append(results, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeWeapon,
			RobotBefore: targetRobot,
			RobotAfter:  targetRobot,
			Damage:      0,
			Positions: map[string]protocol.Position{
				targetRobot.ID: targetRobotPos,
			},
		})
		targetRobotWeapon, err := protocol.TryGetStringWeapon(targetRobotWeapons, targetWeaponID)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		hitRate, err := QueryBattleHitRate(ctx, targetRobot, targetRobotPilot, targetRobotWeapon, robot, robotPilot)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		isHit := rand.Float64() < hitRate
		if isHit {
			damage, err := QueryBattleDamage(ctx, targetRobot, targetRobotPilot, targetRobotWeapon, robot, robotPilot)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			robotAfter := robot
			robotAfter.HP = helper.Max(0, robot.HP-damage)
			// damage
			results = append(results, protocol.BattleAnimation{
				Type:        protocol.BattleResultTypeDamage,
				RobotBefore: robot,
				RobotAfter:  robotAfter,
				Damage:      damage,
				Positions: map[string]protocol.Position{
					robot.ID: robotPos,
				},
			})
			robot = robotAfter
		} else {
			results = append(results, protocol.BattleAnimation{
				Type:        protocol.BattleResultTypeEvade,
				RobotBefore: robot,
				RobotAfter:  robot,
				Positions: map[string]protocol.Position{
					robot.ID: robotPos,
				},
			})
		}
	}
	robot.WeaponsByTransform = protocol.AssocStringWeapons(robot.WeaponsByTransform, robot.Transform, robotWeapons)
	targetRobot.WeaponsByTransform = protocol.AssocStringWeapons(targetRobot.WeaponsByTransform, targetRobot.Transform, targetRobotWeapons)
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, targetRobot.ID, targetRobot)
	ctx.App.Gameplay.Pilots = protocol.AssocStringPilot(ctx.App.Gameplay.Pilots, robotPilot.ID, robotPilot)
	ctx.App.Gameplay.Pilots = protocol.AssocStringPilot(ctx.App.Gameplay.Pilots, targetRobotPilot.ID, targetRobotPilot)
	return ctx, protocol.BattleResult{Animations: results}, nil
}
