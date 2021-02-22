package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"strconv"
)

func QueryUnitsByPlayer(model types.Model, playerID string) ([]string, error) {
	_, err := protocol.TryGetStringPlayer(model.App.Gameplay.Players, playerID)
	if err != nil {
		return []string{}, err
	}
	ret := []string{}
	for ID, robot := range model.App.Gameplay.Robots {
		if robot.PlayerID == playerID {
			ret = append(ret, ID)
		}
	}
	return ret, nil
}

func IsRobotDone(model types.Model, robotID string) (bool, error) {
	return model.App.Gameplay.Tags[robotID].IsDone, nil
}

func QueryRobotArmor(model types.Model, robotID string) (int, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return 0, err
	}
	total := 0
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "armor1", "armor2", "armor3", "armor4", "armor5":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[1], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	return total, nil
}

func QueryRobotBeamArmor(model types.Model, robotID string) (int, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return 0, err
	}
	components, err := QueryRobotComponents(model, robot.ID)
	if err != nil {
		return 0, err
	}
	total := 0
	for _, component := range components {
		val := 0.0
		switch component.ProtoID {
		case "beam_armor1", "beam_armor2", "beam_armor3", "beam_armor4", "beam_armor5":
			if len(component.Value) != 2 {
				return 0, fmt.Errorf("component value's len not right. %v", component)
			}
			val, err = strconv.ParseFloat(component.Value[1], 10)
			if err != nil {
				return 0, fmt.Errorf("component value not right. (%v)", component)
			}
		}
		total += int(val)
	}
	return total, nil
}

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
	robot.HP, err = QueryRobotMaxHp(ctx, robot.ID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	robot.EN, err = QueryRobotMaxEn(ctx, robot.ID)
	if err != nil {
		return origin, protocol.Robot{}, err
	}
	// 算完後再重設
	ctx.App.Gameplay.Robots = protocol.AssocStringRobot(ctx.App.Gameplay.Robots, robot.ID, robot)
	return ctx, robot, nil
}

func NewPilot(origin types.Model, pilot protocol.Pilot) (types.Model, protocol.Pilot, error) {
	var err error
	ctx := origin
	var notFound string
	_, err = data.TryGetStringPilotProto(data.GameData.Pilot, pilot.ProtoID)
	if err != nil {
		return origin, protocol.Pilot{}, err
	}
	if pilot.ID == notFound {
		pilot.ID = fmt.Sprintf("NewPilot_%v", ctx.App.SeqID)
		ctx.App.SeqID++
	}
	// 算完後再重設
	ctx.App.Gameplay.Pilots = protocol.AssocStringPilot(ctx.App.Gameplay.Pilots, pilot.ID, pilot)
	return ctx, pilot, nil
}
