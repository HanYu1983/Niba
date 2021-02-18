package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
)

func QueryRobotComponents(model types.Model, robotID string) (map[string]protocol.Component, error) {
	var err error
	robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, robotID)
	if err != nil {
		return nil, err
	}
	if robot.Components != nil {
		return robot.Components, nil
	}
	robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
	if err != nil {
		return nil, err
	}
	components := map[string]protocol.Component{}
	for i, componentProtoID := range robotProto.Components {
		componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, componentProtoID)
		if err != nil {
			return nil, err
		}
		instanceID := fmt.Sprintf("component_%v", i)
		components[instanceID] = protocol.Component{
			ID:        instanceID,
			ProtoID:   componentProtoID,
			Title:     componentProto.Title,
			Value:     componentProto.Value,
			PowerCost: componentProto.PowerCost,
		}
	}
	for componentID, robotID := range model.App.Lobby.RobotIDByComponentID {
		if robotID != robot.ID {
			continue
		}
		component := model.App.Lobby.Components[componentID]
		componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, component.ProtoID)
		if err != nil {
			return nil, err
		}
		instanceID := component.ID
		components[instanceID] = protocol.Component{
			ID:        instanceID,
			ProtoID:   component.ProtoID,
			Title:     componentProto.Title,
			Value:     componentProto.Value,
			PowerCost: componentProto.PowerCost,
		}
	}
	return components, nil
}
