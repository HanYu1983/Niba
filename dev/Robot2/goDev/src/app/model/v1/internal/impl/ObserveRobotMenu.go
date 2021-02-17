package impl

import (
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func ObserveRobotMenu(model Model, origin protocol.RobotMenu) (protocol.RobotMenu, error) {
	log.Log(protocol.LogCategoryRender, "ObserveRobotMenu", "start")
	log.Log(protocol.LogCategoryRender, "ObserveRobotMenu", fmt.Sprintf("robotMenu(%v)", origin))
	ctx := origin
	if ctx.Active == false {
		return origin, nil
	}
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, ctx.ActiveRobotID)
	if err != nil {
		return origin, err
	}
	ctx.Weapons, err = ObserveWeapons(model, robot, ctx.Weapons)
	if err != nil {
		return origin, err
	}
	log.Log(protocol.LogCategoryRender, "ObserveRobotMenu", "end")
	return ctx, nil
}
