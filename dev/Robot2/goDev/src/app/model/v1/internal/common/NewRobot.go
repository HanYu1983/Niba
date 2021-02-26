package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func NewRobot(origin types.Model, position protocol.Position, robot protocol.Robot) (types.Model, protocol.Robot, error) {
	var err error
	ctx := origin
	var notFound string
	_, err = data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	if robot.PlayerID == notFound {
		return origin, protocol.Robot{}, fmt.Errorf("robot(%v) PlayerID not found", robot)
	}
	if robot.PilotID == notFound {
		return origin, protocol.Robot{}, fmt.Errorf("robot(%v) PilotID not found", robot)
	}
	_, err = protocol.TryGetStringPilot(ctx.App.Gameplay.Pilots, robot.PilotID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	if robot.ID == notFound {
		robot.ID = fmt.Sprintf("NewRobot_%v", ctx.App.SeqID)
		ctx.App.SeqID++
	}
	if robot.Transform == notFound {
		robot.Transform = robot.ProtoID
	}
	if robot.Transform != robot.ProtoID {
		return origin, protocol.Robot{}, fmt.Errorf("transform(%v) must equals protoID(%v)", robot.Transform, robot.ProtoID)
	}
	if robot.WeaponsByTransform == nil {
		robot.WeaponsByTransform = map[string]protocol.Weapons{}
	}
	// 先將機器人丟到場上
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	ctx.App.Gameplay.Positions = protocol.AssocStringPosition(ctx.App.Gameplay.Positions, robot.ID, position)
	ctx.App.Gameplay.Units = append(ctx.App.Gameplay.Units, robot.ID)
	// 再計算機器人的狀態
	robot.HP, err = QueryRobotMaxHp(ctx, robot.ID, true)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	robot.EN, err = QueryRobotMaxEn(ctx, robot.ID, true)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	// 算完後再重設
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	return ctx, robot, nil
}
