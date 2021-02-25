package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"math/rand"
	"tool/log"
)

func OnRobotBattle(origin uidata.UI, robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnRobotBattle", "start")
	var err error
	ctx := origin
	ctx, _, err = Battle(ctx, robotID, weaponID, targetRobotID, targetAction, targetWeaponID)
	if err != nil {
		return origin, err
	}
	// handle robot die
	// robotWillDelete := []protocol.Robot{}
	// for _, robot := range ctx.Model.(Model).App.Gameplay.Robots {
	// 	if robot.HP > 0 {
	// 		continue
	// 	}
	// 	robotWillDelete = append(robotWillDelete, robot)
	// }
	// model := ctx.Model.(Model)
	// for _, robot := range robotWillDelete {
	// 	model.App.Gameplay.Robots = protocol.DissocStringRobot(model.App.Gameplay.Robots, robot.ID)
	// 	model.App.Gameplay.Positions = protocol.DissocStringPosition(model.App.Gameplay.Positions, robot.ID)
	// 	model.App.Gameplay.Tags = protocol.DissocStringTag(model.App.Gameplay.Tags, robot.ID)
	// 	model.App.Gameplay.Pilots = protocol.DissocStringPilot(model.App.Gameplay.Pilots, robot.PilotID)
	// }
	// ctx.Model = model
	log.Log(protocol.LogCategoryPhase, "OnRobotBattle", "end")
	return ctx, nil
}

func Battle(origin uidata.UI, robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (uidata.UI, protocol.BattleResult, error) {
	log.Log(protocol.LogCategoryPhase, "Battle", "start")
	ctx := origin
	_model := types.Model(ctx.Model.(Model))
	view := def.View
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotWeapons, err := common.QueryRobotWeapons(_model, robot.ID, robot.Transform)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotWeapon, err := protocol.TryGetStringWeapon(robotWeapons, weaponID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, targetRobotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotPilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, targetRobot.PilotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotWeapons, err := common.QueryRobotWeapons(_model, targetRobot.ID, targetRobot.Transform)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	targetRobotPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, targetRobotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	battleResult := protocol.BattleResult{
		Animations: []protocol.BattleAnimation{},
	}
	// 先進行攻擊方
	// 消費彈藥
	{
		_robot := robot
		_robotPos := robotPos
		_weapon := robotWeapon
		_weapons := robotWeapons
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, _weapon.ProtoID)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		_robotAfter := _robot
		switch weaponProto.EnergyType {
		case "energy":
			cost := weaponProto.EnergyCost
			if _robot.EN < cost {
				return origin, protocol.BattleResult{}, fmt.Errorf("robot.EN(%v) not enougth for cost(%v)", _robot.EN, cost)
			}
			_robotAfter.EN = _robotAfter.EN - cost
		case "bullet":
			if _weapon.BulletCount == 0 {
				return origin, protocol.BattleResult{}, fmt.Errorf("weapon.BulletCount not enougth")
			}
			_weapon.BulletCount--
			_weapons = protocol.AssocStringWeapon(_weapons, _weapon.ID, _weapon)
			_robotAfter.WeaponsByTransform[_robotAfter.Transform] = _weapons
		default:
			return origin, protocol.BattleResult{}, fmt.Errorf("unknown energy type(%+v)", _weapon)
		}
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeWeapon,
			RobotBefore: _robot,
			RobotAfter:  _robotAfter,
			Damage:      0,
			Positions: map[string]protocol.Position{
				_robot.ID: _robotPos,
			},
		})
		robot = _robotAfter
	}
	// 命中率
	hitRate, err := impl.QueryBattleHitRate(_model, robot, robotPilot, robotWeapon, targetRobot, targetRobotPilot)
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
		damage, err := impl.QueryBattleDamage(_model, robot, robotPilot, robotWeapon, targetRobot, targetRobotPilot)
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
		targetRobotAfter.HP = helper.Max(0, targetRobotAfter.HP-damage)
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
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
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeEvade,
			RobotBefore: targetRobot,
			RobotAfter:  targetRobot,
			Positions: map[string]protocol.Position{
				targetRobot.ID: targetRobotPos,
			},
		})
	}
	if targetRobot.HP <= 0 {
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeDie,
			RobotBefore: targetRobot,
			RobotAfter:  targetRobot,
			Positions: map[string]protocol.Position{
				targetRobot.ID: targetRobotPos,
			},
		})
		goto ANIMATE
	}
	// 再進行防守方
	switch targetAction {
	case protocol.BattleMenuActionAttack:
		// 瞄準
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeAim,
			AimPosition: [2]protocol.Position{targetRobotPos, robotPos},
		})
		targetRobotWeapon, err := protocol.TryGetStringWeapon(targetRobotWeapons, targetWeaponID)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		// 消費彈藥
		{
			_robot := targetRobot
			_robotPos := targetRobotPos
			_weapon := targetRobotWeapon
			_weapons := targetRobotWeapons
			weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, _weapon.ProtoID)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			_robotAfter := _robot
			switch weaponProto.EnergyType {
			case "energy":
				cost := weaponProto.EnergyCost
				if _robot.EN < cost {
					return origin, protocol.BattleResult{}, fmt.Errorf("robot.EN(%v) not enougth for cost(%v)", robot.EN, cost)
				}
				_robotAfter.EN = _robotAfter.EN - cost
			case "bullet":
				if _weapon.BulletCount == 0 {
					return origin, protocol.BattleResult{}, fmt.Errorf("weapon.BulletCount not enougth")
				}
				_weapon.BulletCount--
				_weapons = protocol.AssocStringWeapon(_weapons, _weapon.ID, _weapon)
				_robotAfter.WeaponsByTransform[_robotAfter.Transform] = _weapons
			default:
				return origin, protocol.BattleResult{}, fmt.Errorf("unknown energy type(%+v)", _weapon)
			}
			battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
				Type:        protocol.BattleResultTypeWeapon,
				RobotBefore: _robot,
				RobotAfter:  _robotAfter,
				Damage:      0,
				Positions: map[string]protocol.Position{
					_robot.ID: _robotPos,
				},
			})
			targetRobot = _robotAfter
		}
		hitRate, err := impl.QueryBattleHitRate(_model, targetRobot, targetRobotPilot, targetRobotWeapon, robot, robotPilot)
		if err != nil {
			return origin, protocol.BattleResult{}, err
		}
		isHit := rand.Float64() < hitRate
		if isHit {
			damage, err := impl.QueryBattleDamage(_model, targetRobot, targetRobotPilot, targetRobotWeapon, robot, robotPilot)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			robotAfter := robot
			robotAfter.HP = helper.Max(0, robotAfter.HP-damage)
			// damage
			battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
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
			battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
				Type:        protocol.BattleResultTypeEvade,
				RobotBefore: robot,
				RobotAfter:  robot,
				Positions: map[string]protocol.Position{
					robot.ID: robotPos,
				},
			})
		}
	}
	if robot.HP <= 0 {
		battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
			Type:        protocol.BattleResultTypeDie,
			RobotBefore: robot,
			RobotAfter:  robot,
			Positions: map[string]protocol.Position{
				robot.ID: robotPos,
			},
		})
	}
ANIMATE:
	// 先畫完動畫再應用資料, 因為機器人爆去後資料會被刪除, 所以在轉資料(RenderRobotBattle)給前端時找不到資料
	// 關掉battleMenuh後再畫戰鬥動畫
	ctx, err = OnDisableBattleMenu(ctx)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	view.RenderRobotBattle(ctx, battleResult)
	_model = types.Model(ctx.Model.(Model))
	if robot.HP <= 0 {
		_model.App.Gameplay.Robots = protocol.DissocStringRobot(_model.App.Gameplay.Robots, robot.ID)
		_model.App.Gameplay.Positions = protocol.DissocStringPosition(_model.App.Gameplay.Positions, robot.ID)
		_model.App.Gameplay.Tags = protocol.DissocStringTag(_model.App.Gameplay.Tags, robot.ID)
		_model.App.Gameplay.Pilots = protocol.DissocStringPilot(_model.App.Gameplay.Pilots, robot.PilotID)
	} else {
		_model.App.Gameplay.Robots = protocol.AssocStringRobot(_model.App.Gameplay.Robots, robot.ID, robot)
		_model.App.Gameplay.Pilots = protocol.AssocStringPilot(_model.App.Gameplay.Pilots, robotPilot.ID, robotPilot)
	}
	if targetRobot.HP <= 0 {
		_model.App.Gameplay.Robots = protocol.DissocStringRobot(_model.App.Gameplay.Robots, targetRobot.ID)
		_model.App.Gameplay.Positions = protocol.DissocStringPosition(_model.App.Gameplay.Positions, targetRobot.ID)
		_model.App.Gameplay.Tags = protocol.DissocStringTag(_model.App.Gameplay.Tags, targetRobot.ID)
		_model.App.Gameplay.Pilots = protocol.DissocStringPilot(_model.App.Gameplay.Pilots, targetRobot.PilotID)
	} else {
		_model.App.Gameplay.Robots = protocol.AssocStringRobot(_model.App.Gameplay.Robots, targetRobot.ID, targetRobot)
		_model.App.Gameplay.Pilots = protocol.AssocStringPilot(_model.App.Gameplay.Pilots, targetRobotPilot.ID, targetRobotPilot)
	}
	_model, err = impl.OnRobotBattleEnd(_model, robot, targetRobot)
	if err != nil {
		return origin, battleResult, err
	}
	_model, err = impl.OnRobotBattleEnd(_model, targetRobot, robot)
	if err != nil {
		return origin, battleResult, err
	}
	ctx.Model = Model(_model)
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, battleResult, err
	}
	log.Log(protocol.LogCategoryPhase, "Battle", "end")
	return ctx, battleResult, nil
}
