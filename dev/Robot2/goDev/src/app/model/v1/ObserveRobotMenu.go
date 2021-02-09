package v1

import (
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func ObserveRobotMenu(model model, origin protocol.RobotMenu) (protocol.RobotMenu, error) {
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
	return ctx, nil
}