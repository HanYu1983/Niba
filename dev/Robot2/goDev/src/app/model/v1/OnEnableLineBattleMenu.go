package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/log"
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
	// gameplayPage
	gameplayPage := ctx.GameplayPages[uidata.PageGameplay]
	gameplayPage.HitMarks = append(gameplayPage.HitMarks, protocol.HitMark{})
	//
	// fromPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, robotID)
	// if err != nil {
	// 	return origin, err
	// }
	// toPos := targetPosition

	// leftTop := protocol.Position{helper.Min(fromPos[0], toPos[0]), helper.Min(fromPos[1], toPos[1])}
	// rightBottom := protocol.Position{helper.Max(fromPos[0], toPos[0]), helper.Max(fromPos[1], toPos[1])}
	// unitsInRegion := SearchUnitByRegion(_model.App.Gameplay.Positions, leftTop, rightBottom)

	// dx, dy := toPos[0]-fromPos[0], toPos[1]-fromPos[1]
	// for _, unitID := range unitsInRegion {
	// 	unitPos, err := protocol.TryGetStringPosition(_model.App.Gameplay.Positions, unitID)
	// 	if err != nil {
	// 		return origin, err
	// 	}
	// 	dx2, dy2 := unitPos[0]-fromPos[0], unitPos[1]-fromPos[1]
	// }
	// for y := leftTop[1]; y <= rightBottom[1]; y++ {
	// 	for x := leftTop[0]; x <= rightBottom[0]; x++ {

	// 	}
	// }
	// apply
	ctx.Model = _model
	ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, uidata.PageGameplay, gameplayPage)
	log.Log(protocol.LogCategoryInfo, "OnEnableLineBattleMenu", "end")
	return ctx, nil
}
