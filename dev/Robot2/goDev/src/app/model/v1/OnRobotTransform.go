package v1

import (
	"app/tool"
	"app/tool/data"
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
	"tool/log"
)

func OnRobotTransform(origin uidata.UI, robotID string, transform string) (uidata.UI, error) {
	log.Log(protocol.LogCategoryPhase, "OnRobotTransform", fmt.Sprintf("robotID(%v) transform(%v)", robotID, transform))
	ctx := origin
	robot, err := protocol.TryGetStringRobot(ctx.Model.(model).App.Gameplay.Robots, robotID)
	if err != nil {
		return origin, nil
	}
	if robot.Transform == transform {
		log.Log(protocol.LogCategoryWarning, "OnRobotTransform", fmt.Sprintf("already transform (%v)", robot.Transform))
		return origin, nil
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return origin, nil
	}
	hasTransform := len(tool.FilterString(robotProto.Transform, func(curr string) bool {
		return curr == transform
	})) > 0
	if hasTransform == false {
		return origin, fmt.Errorf("you can not transform(%v), you transform list is (%v)", transform, robotProto.Transform)
	}
	robot.Transform = transform
	robot.ProtoID = transform
	model := ctx.Model.(model)
	model.App.Gameplay.Robots = protocol.AssocStringRobot(model.App.Gameplay.Robots, robot.ID, robot)
	ctx.Model = model
	return ctx, nil
}
