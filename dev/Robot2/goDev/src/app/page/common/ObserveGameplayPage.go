package common

import (
	"app/tool"
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func ObserveGameplayPage(origin uidata.UI, id int) (uidata.UI, error) {
	//var err error
	ctx := origin
	model := def.Model
	gameplayPage := ctx.GameplayPages[id]
	modelMap := model.GetMap()
	// camera
	gameplayPage.Camera[0] = tool.Max(0, tool.Min(len(modelMap[0])-uidata.MapWidth, gameplayPage.Camera[0]))
	gameplayPage.Camera[1] = tool.Max(0, tool.Min(len(modelMap)-uidata.MapHeight, gameplayPage.Camera[1]))
	// cursor
	gameplayPage.Cursor = tool.World2Local(gameplayPage.Camera, model.GetCursor())
	gameplayPage.Cursor[0] = tool.Max(0, tool.Min(gameplayPage.Cursor[0], uidata.MapWidth-1))
	gameplayPage.Cursor[1] = tool.Max(0, tool.Min(gameplayPage.Cursor[1], uidata.MapHeight-1))
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
		pos := model.GetGameplayPositions()[id]
		localPosDict[id] = tool.World2Local(gameplayPage.Camera, pos)
	}
	gameplayPage.Positions = localPosDict
	// tags
	gameplayPage.Tags = model.GetGameplayTags()
	// move range
	moveRange := model.GetMoveRange()
	if moveRange != nil {
		for i, pos := range moveRange {
			moveRange[i] = tool.World2Local(gameplayPage.Camera, pos)
		}
		gameplayPage.MoveRange = moveRange
	} else {
		gameplayPage.MoveRange = []protocol.Position{}
	}
	// unitMenu
	unitMenuModel := model.GetRobotMenu()
	if unitMenuModel.Active {
		unitMenu := ctx.Menu2Ds[uidata.Menu2DUnitMenu]
		isSelectingWeapon := unitMenuModel.RowFunctionMapping[unitMenu.Cursor1] == protocol.RobotMenuFunctionWeapon
		log.Log(protocol.LogCategoryDetail, "ObserveGameplayPage", fmt.Sprintf("isSelectingWeapon(%v)", isSelectingWeapon))
		if isSelectingWeapon {
			selectedWeaponID, err := tool.TryGetString2(unitMenu.Options, unitMenu.Cursor1)(tool.TryGetInt(unitMenu.Cursor2, unitMenu.Cursor1))
			if err != nil {
				return origin, err
			}
			selectedWeapon := unitMenuModel.Weapons[selectedWeaponID]
			log.Log(protocol.LogCategoryDetail, "ObserveGameplayPage", fmt.Sprintf("selectedWeapon(%v)", selectedWeapon))
			robotPos := gameplayPage.Positions[unitMenuModel.ActiveRobotID]
			log.Log(protocol.LogCategoryDetail, "ObserveGameplayPage", fmt.Sprintf("robotPos(%v)", robotPos))
			attackRange, err := tool.QueryMinMaxAttackRange(uidata.MapWidth, uidata.MapHeight, selectedWeapon.Range[0], selectedWeapon.Range[1], robotPos)
			if err != nil {
				return origin, err
			}
			gameplayPage.AttackRange = attackRange
		} else {
			gameplayPage.AttackRange = []protocol.Position{}
		}
	}
	ctx.Actives = uidata.AssocIntBool(ctx.Actives, uidata.PageUnitMenu, unitMenuModel.Active)
	// apply
	ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, id, gameplayPage)
	return ctx, nil
}
