package v1

import (
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
	_model := ctx.Model.(model)
	robot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, err
	}
	weapons, err := QueryRobotWeapons(_model, robot.ID, robot.Transform)
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
			invalidWeapons, err = CheckInvalidWeapons(_model, robot, weapons)
		}
		robotMenu.Active = true
		robotMenu.ActiveRobotID = robot.ID
		robotMenu.Options = options
		robotMenu.RowFunctionMapping = rowFunctionMapping
		robotMenu.Weapons = weapons
		robotMenu.InvalidWeapons = invalidWeapons
	}
	_model.App.Gameplay.RobotMenu = robotMenu
	_model.App.Gameplay.HitMarks = map[string]protocol.HitMark{}

	fromPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, robotID)
	if err != nil {
		return origin, err
	}
	toPos := targetPosition
	weaponRange, err := QueryRobotWeaponRange(_model, robot, weapon)
	if err != nil {
		return origin, err
	}
	weaponRangeLength := weaponRange[0]
	weaponRangeWidth := weaponRange[1] / 2

	leftTop := protocol.Position{fromPos[0] - 10, fromPos[0] - 10}
	rightBottom := protocol.Position{fromPos[0] + 10, fromPos[0] + 10}
	unitsInRegion := SearchUnitByRegion(_model.App.Gameplay.Positions, leftTop, rightBottom)

	fromPosV2 := mgl64.Vec2{float64(fromPos[0]), float64(fromPos[1])}
	toPosV2 := mgl64.Vec2{float64(toPos[0]), float64(toPos[1])}
	dir1 := toPosV2.Sub(fromPosV2).Normalize()
	normal := dir1.Vec3(0).Cross(mgl64.Vec3{0, 0, 1.0}).Vec2().Normalize()
	log.Log(protocol.LogCategoryDetail, "OnEnableLineBattleMenu", fmt.Sprintf("from(%v) to(%v) normal(%v)", fromPos, toPos, normal))
	for _, unitID := range unitsInRegion {
		if unitID == robot.ID {
			continue
		}
		targetRobot, err := protocol.TryGetStringRobot(_model.App.Gameplay.Robots, unitID)
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
		if distanceWidth > float64(weaponRangeWidth) {
			continue
		}
		log.Log(protocol.LogCategoryDetail, "OnEnableLineBattleMenu", fmt.Sprintf("dir2(%v) distance2line(%v)", dir2, distanceWidth))
		var _ = targetRobot
		_model.App.Gameplay.HitMarks[unitID] = protocol.HitMark{
			Rate: 1.0 - (distanceWidth / float64(weaponRangeWidth)),
		}
	}

	// apply
	ctx.Model = _model
	log.Log(protocol.LogCategoryInfo, "OnEnableLineBattleMenu", "end")
	return ctx, nil
}
