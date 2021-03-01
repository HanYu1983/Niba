package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"math"
	"tool/log"

	"github.com/go-gl/mathgl/mgl64"
)

func OnEnableLineBattleMenu(origin uidata.UI, robotID string, weaponID string, targetPosition protocol.Position) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnEnableLineBattleMenu", "start")
	ctx := origin
	_model := types.Model(ctx.Model.(Model))
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}
	pilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, err
	}
	weapons, err := common.QueryRobotWeapons(_model, robot.ID, robot.Transform, true)
	if err != nil {
		return origin, err
	}
	weapon, err := protocol.TryGetStringWeapon(weapons, weaponID)
	if err != nil {
		return origin, err
	}
	// robotMenu
	robotMenu := _model.App.Gameplay.RobotMenu
	{
		options := [][]string{}
		rowFunctionMapping := map[int]int{}
		weapons := map[string]protocol.Weapon{weapon.ID: weapon}
		if len(weapons) > 0 {
			rowFunctionMapping[len(options)] = protocol.RobotMenuFunctionWeapon
			options = append(options, protocol.KesStringWeapon(weapons))
		}
		invalidWeapons := map[string]string{}
		if len(weapons) > 0 {
			invalidWeapons, err = common.CheckInvalidWeapons(_model, robot.ID, weapons, nil)
		}
		robotMenu.Active = true
		robotMenu.ActiveRobotID = robot.ID
		robotMenu.Options = options
		robotMenu.RowFunctionMapping = rowFunctionMapping
		robotMenu.Weapons = weapons
		robotMenu.InvalidWeapons = invalidWeapons
	}
	_model.App.Gameplay.RobotMenu = robotMenu
	// 計算受機的機體和比例
	{
		_model.App.Gameplay.HitMarks = map[string]protocol.HitMark{}

		// 準備參數
		fromPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, robotID)
		if err != nil {
			return origin, err
		}
		toPos := targetPosition
		weaponRange, err := common.QueryRobotWeaponRange(_model, robot.ID, weapon, true)
		if err != nil {
			return origin, err
		}
		weaponRangeLength := weaponRange[0]
		weaponRangeWidth := weaponRange[1] / 2

		// 找出周圍的機體
		size := 10
		leftTop := protocol.Position{fromPos[0] - size, fromPos[0] - size}
		rightBottom := protocol.Position{fromPos[0] + size, fromPos[0] + size}
		unitsInRegion := common.SearchUnitByRegion(_model.App.Gameplay.Positions, leftTop, rightBottom)

		// 射線和法線
		fromPosV2 := mgl64.Vec2{float64(fromPos[0]), float64(fromPos[1])}
		toPosV2 := mgl64.Vec2{float64(toPos[0]), float64(toPos[1])}
		dir1 := toPosV2.Sub(fromPosV2).Normalize()
		normal := dir1.Vec3(0).Cross(mgl64.Vec3{0, 0, 1.0}).Vec2().Normalize()
		log.Log(protocol.LogCategoryDetail, "OnEnableLineBattleMenu", fmt.Sprintf("from(%v) to(%v) normal(%v)", fromPos, toPos, normal))
		// 找出射線線段內的機體, 不分敵我
		for _, unitID := range unitsInRegion {
			if unitID == robot.ID {
				continue
			}
			targetRobot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, unitID)
			if err != nil {
				return origin, err
			}
			targetPilot, err := protocol.TryGetStringPilot(_model.App.Gameplay.Pilots, targetRobot.PilotID)
			if err != nil {
				return origin, err
			}
			targetPosition, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, unitID)
			if err != nil {
				return origin, err
			}
			unitPosV2 := mgl64.Vec2{float64(targetPosition[0]), float64(targetPosition[1])}
			dir2 := unitPosV2.Sub(fromPosV2)
			distanceLength := dir2.Dot(dir1)
			// 背面的
			if distanceLength <= 0 {
				continue
			}
			// 超過射程
			if distanceLength > float64(weaponRangeLength) {
				continue
			}
			// 超過射線粗度
			distanceWidth := math.Abs(dir2.Dot(normal))
			if distanceWidth >= float64(weaponRangeWidth) {
				continue
			}
			log.Log(protocol.LogCategoryDetail, "OnEnableLineBattleMenu", fmt.Sprintf("dir2(%v) distance2line(%v)", dir2, distanceWidth))
			// 機體在射線內的比例
			rate := 1.0 - (distanceWidth / float64(weaponRangeWidth))
			// 命中率加成比例
			hitRate, err := impl.QueryBattleHitRate(_model, robot, pilot, weapon, targetRobot, targetPilot)
			if err != nil {
				return origin, err
			}
			hitRate = hitRate * rate
			_model.App.Gameplay.HitMarks[unitID] = protocol.HitMark{
				HitRate: hitRate,
				Rate:    rate,
			}
		}

		// 收集攻擊範圍
		attackRange := []protocol.Position{}
		for y := -size; y <= size; y++ {
			for x := -size; x <= size; x++ {
				cx, cy := x+fromPos[0], y+fromPos[1]
				currPos := mgl64.Vec2{float64(cx), float64(cy)}
				dir2 := currPos.Sub(fromPosV2)
				distanceLength := dir2.Dot(dir1)
				// 背面的
				if distanceLength <= 0 {
					continue
				}
				// 超過射程
				if distanceLength > float64(weaponRangeLength) {
					continue
				}
				// 超過射線粗度
				distanceWidth := math.Abs(dir2.Dot(normal))
				if distanceWidth >= float64(weaponRangeWidth) {
					continue
				}
				attackRange = append(attackRange, protocol.Position{cx, cy})
			}
		}
		_model.App.Gameplay.MapAttackRange = attackRange
	}

	// apply
	ctx.Model = Model(_model)
	{
		// 重設Cursor
		menu, err := uidata.TryGetIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu)
		if err != nil {
			return origin, err
		}
		menu.Cursor1 = 0
		ctx.Menu2Ds = uidata.AssocIntMenu2D(ctx.Menu2Ds, uidata.Menu2DUnitMenu, menu)
	}
	log.Log(protocol.LogCategoryInfo, "OnEnableLineBattleMenu", "end")
	return ctx, nil
}
