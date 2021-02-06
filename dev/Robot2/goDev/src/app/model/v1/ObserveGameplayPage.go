package v1

import (
	"app/tool"
	"app/tool/helper"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func ObserveGameplayPage(origin uidata.UI, id int) (uidata.UI, error) {
	//var err error
	ctx := origin
	model := ctx.Model.(model)
	gameplayPage := ctx.GameplayPages[id]
	modelMap := model.App.Gameplay.Map
	cursor := model.App.Gameplay.Cursor
	// camera
	gameplayPage.Camera[0] = helper.Max(0, helper.Min(len(modelMap[0])-uidata.MapWidth, gameplayPage.Camera[0]))
	gameplayPage.Camera[1] = helper.Max(0, helper.Min(len(modelMap)-uidata.MapHeight, gameplayPage.Camera[1]))
	// cursor
	gameplayPage.Cursor = helper.World2Local(gameplayPage.Camera, cursor)
	gameplayPage.Cursor[0] = helper.Max(0, helper.Min(gameplayPage.Cursor[0], uidata.MapWidth-1))
	gameplayPage.Cursor[1] = helper.Max(0, helper.Min(gameplayPage.Cursor[1], uidata.MapHeight-1))
	// local map
	for x := 0; x < len(gameplayPage.Map[0]); x++ {
		for y := 0; y < len(gameplayPage.Map); y++ {
			gameplayPage.Map[y][x] = modelMap[gameplayPage.Camera[1]+y][gameplayPage.Camera[0]+x]
		}
	}
	// local units
	leftTop := gameplayPage.Camera
	rightBottom := protocol.Position{leftTop[0] + uidata.MapWidth, leftTop[1] + uidata.MapHeight}
	gameplayPage.Units = model.QueryUnitsByRegion(leftTop, rightBottom)
	// local position
	localPosDict := map[string]protocol.Position{}
	for _, id := range gameplayPage.Units {
		pos := model.App.Gameplay.Positions[id]
		localPosDict[id] = helper.World2Local(gameplayPage.Camera, pos)
	}
	gameplayPage.Positions = localPosDict
	// robots
	gameplayPage.Robots = model.App.Gameplay.Robots
	// items
	gameplayPage.Items = model.App.Gameplay.Items
	// tags
	gameplayPage.Tags = model.App.Gameplay.Tags
	// move range
	moveRange := model.App.Gameplay.MoveRange
	if moveRange != nil {
		var moveRangeLocal = []protocol.Position{}
		for _, pos := range moveRange {
			moveRangeLocal = append(moveRangeLocal, helper.World2Local(gameplayPage.Camera, pos))
		}
		gameplayPage.MoveRange = moveRangeLocal
	} else {
		gameplayPage.MoveRange = []protocol.Position{}
	}
	// select weapon attack range
	unitMenuModel := model.App.Gameplay.RobotMenu
	if unitMenuModel.Active {
		unitMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		activeRobot, err := protocol.TryGetStringRobot(gameplayPage.Robots, unitMenuModel.ActiveRobotID)
		if err != nil {
			return origin, err
		}
		isSelectingWeapon := unitMenuModel.RowFunctionMapping[unitMenu.Cursor1] == protocol.RobotMenuFunctionWeapon
		log.Log(protocol.LogCategoryRender, "Model.Render", fmt.Sprintf("isSelectingWeapon(%v)", isSelectingWeapon))
		if isSelectingWeapon {
			selectedWeaponID, err := tool.TryGetString2(unitMenu.Options, unitMenu.Cursor1)(tool.TryGetInt(unitMenu.Cursor2, unitMenu.Cursor1))
			if err != nil {
				return origin, err
			}
			selectedWeapon := unitMenuModel.Weapons[selectedWeaponID]
			log.Log(protocol.LogCategoryRender, "Model.Render", fmt.Sprintf("selectedWeapon(%v)", selectedWeapon))
			robotPos := gameplayPage.Positions[unitMenuModel.ActiveRobotID]
			log.Log(protocol.LogCategoryRender, "Model.Render", fmt.Sprintf("robotPos(%v)", robotPos))
			attackRange, err := QueryRobotWeaponAttackRange(model, activeRobot, selectedWeapon, robotPos)
			if err != nil {
				return origin, err
			}
			gameplayPage.AttackRange = attackRange
		} else {
			gameplayPage.AttackRange = []protocol.Position{}
		}
	} else {
		gameplayPage.AttackRange = []protocol.Position{}
	}
	// unit menu
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, unitMenuModel.Active)
	// battle menu
	battleMenuModel := model.App.Gameplay.BattleMenu
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageBattleMenu, battleMenuModel.Active)
	// apply
	ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, id, gameplayPage)
	return ctx, nil
}
