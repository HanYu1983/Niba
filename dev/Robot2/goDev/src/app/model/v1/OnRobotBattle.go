package v1

import (
	"app/tool/def"
	"app/tool/protocol"
	"app/tool/uidata"
)

func OnRobotBattle(origin uidata.UI, robotID string, weaponID string, targetRobotID string, targetAction int, targetWeaponID string) (uidata.UI, error) {
	var err error
	ctx := origin
	view := def.View
	var result protocol.BattleResult
	ctx.Model, result, err = Battle(ctx.Model.(model), robotID, weaponID, targetRobotID, targetAction, targetWeaponID)
	if err != nil {
		return origin, err
	}
	// 關掉battleMenuh後再畫戰鬥動畫
	ctx.Model, err = ctx.Model.DisableBattleMenu()
	if err != nil {
		return origin, err
	}
	ctx, err = ObservePage(ctx, uidata.PageGameplay)
	if err != nil {
		return origin, err
	}
	view.Render(ctx)
	view.RenderRobotBattle(ctx, result)
	// handle robot die
	robotWillDelete := []protocol.Robot{}
	for _, robot := range ctx.Model.(model).App.Gameplay.Robots {
		if robot.HP > 0 {
			continue
		}
		robotWillDelete = append(robotWillDelete, robot)
	}
	model := ctx.Model.(model)
	for _, robot := range robotWillDelete {
		model.App.Gameplay.Robots = protocol.DissocStringRobot(model.App.Gameplay.Robots, robot.ID)
		model.App.Gameplay.Positions = protocol.DissocStringPosition(model.App.Gameplay.Positions, robot.ID)
		model.App.Gameplay.Tags = protocol.DissocStringTag(model.App.Gameplay.Tags, robot.ID)
		model.App.Gameplay.Pilots = protocol.DissocStringPilot(model.App.Gameplay.Pilots, robot.PilotID)
	}
	ctx.Model = model
	return ctx, nil
}
