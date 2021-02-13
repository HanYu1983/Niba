package v1

import (
	"app/tool/data"
	"app/tool/def"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"math/rand"
	"tool/log"
)

func OnRobotLineBattle(origin uidata.UI, robotID string, weaponID string, targetPosition protocol.Position) (uidata.UI, protocol.BattleResult, error) {
	log.Log(protocol.LogCategoryPhase, "OnRobotLineBattle", "start")
	ctx := origin
	view := def.View
	_model := ctx.Model.(model)
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, robotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	robotPilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	weapons, err := QueryRobotWeapons(_model, robot.ID, robot.Transform)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	battleResult := protocol.BattleResult{
		Animations: []protocol.BattleAnimation{},
	}
	// 消費彈藥
	{
		_robot := robot
		_robotPos := robotPos
		_weapon := weapon
		_weapons := weapons
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
	if robot.HP <= 0 {
		_model.App.Gameplay.Robots = protocol.DissocStringRobot(_model.App.Gameplay.Robots, robot.ID)
		_model.App.Gameplay.Positions = protocol.DissocStringPosition(_model.App.Gameplay.Positions, robot.ID)
		_model.App.Gameplay.Tags = protocol.DissocStringTag(_model.App.Gameplay.Tags, robot.ID)
		_model.App.Gameplay.Pilots = protocol.DissocStringPilot(_model.App.Gameplay.Pilots, robot.PilotID)
	} else {
		_model.App.Gameplay.Robots = protocol.AssocStringRobot(_model.App.Gameplay.Robots, robot.ID, robot)
		_model.App.Gameplay.Pilots = protocol.AssocStringPilot(_model.App.Gameplay.Pilots, robotPilot.ID, robotPilot)
	}
	{
		// 所有目標
		marks := ctx.Model.(model).App.Gameplay.HitMarks
		for targetRobotID, mark := range marks {
			hitRate := mark.HitRate
			rate := mark.Rate
			targetRobot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, targetRobotID)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			targetRobotPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, targetRobot.ID)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			targetRobotPilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, targetRobot.PilotID)
			if err != nil {
				return origin, protocol.BattleResult{}, err
			}
			isHit := rand.Float64() < hitRate
			if isHit {
				// 傷害加成比例
				damage, err := QueryBattleDamage(_model, robot, robotPilot, weapon, targetRobot, targetRobotPilot)
				if err != nil {
					return origin, protocol.BattleResult{}, err
				}
				damage = int(float64(damage) * rate)
				// 傷害動畫
				targetRobotAfter := targetRobot
				targetRobotAfter.HP = helper.Max(0, targetRobotAfter.HP-damage)
				battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
					Type:        protocol.BattleResultTypeDamage,
					RobotBefore: targetRobot,
					RobotAfter:  targetRobotAfter,
					Damage:      damage,
					Positions: map[string]protocol.Position{
						targetRobot.ID: targetRobotPos,
					},
				})
				targetRobot = targetRobotAfter
				// 死亡動畫
				if targetRobot.HP <= 0 {
					battleResult.Animations = append(battleResult.Animations, protocol.BattleAnimation{
						Type:        protocol.BattleResultTypeDie,
						RobotBefore: targetRobot,
						RobotAfter:  targetRobot,
						Positions: map[string]protocol.Position{
							targetRobot.ID: targetRobotPos,
						},
					})
				}
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
				_model.App.Gameplay.Robots = protocol.DissocStringRobot(_model.App.Gameplay.Robots, targetRobot.ID)
				_model.App.Gameplay.Positions = protocol.DissocStringPosition(_model.App.Gameplay.Positions, targetRobot.ID)
				_model.App.Gameplay.Tags = protocol.DissocStringTag(_model.App.Gameplay.Tags, targetRobot.ID)
				_model.App.Gameplay.Pilots = protocol.DissocStringPilot(_model.App.Gameplay.Pilots, targetRobot.PilotID)
			} else {
				_model.App.Gameplay.Robots = protocol.AssocStringRobot(_model.App.Gameplay.Robots, targetRobot.ID, targetRobot)
				_model.App.Gameplay.Pilots = protocol.AssocStringPilot(_model.App.Gameplay.Pilots, targetRobotPilot.ID, targetRobotPilot)
			}
		}
	}
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
	// 套用
	ctx.Model = _model
	ctx, err = view.Render(ctx)
	if err != nil {
		return origin, protocol.BattleResult{}, err
	}
	log.Log(protocol.LogCategoryPhase, "OnRobotLineBattle", "end")
	return ctx, battleResult, nil
}
