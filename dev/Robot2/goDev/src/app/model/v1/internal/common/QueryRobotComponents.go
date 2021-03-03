package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func QueryRobotComponents(model types.Model, robotID string, isGameplay bool) (map[string]protocol.Component, error) {
	log.Log(protocol.LogCategoryRender, "QueryRobotComponents", "start")
	var err error
	robot, err := QueryRobot(model, robotID, isGameplay)
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
		// componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, componentProtoID)
		// if err != nil {
		// 	return nil, err
		// }
		instanceID := fmt.Sprintf("component_%v", i)
		components[instanceID] = protocol.Component{
			ID:      instanceID,
			ProtoID: componentProtoID,
		}
	}
	for componentID, robotID := range model.App.Lobby.RobotIDByComponentID {
		if robotID != robot.ID {
			continue
		}
		component := model.App.Lobby.Components[componentID]
		// componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, component.ProtoID)
		// if err != nil {
		// 	return nil, err
		// }
		instanceID := component.ID
		components[instanceID] = protocol.Component{
			ID:      instanceID,
			ProtoID: component.ProtoID,
		}
	}
	log.Log(protocol.LogCategoryRender, "QueryRobotComponents", "end")
	return components, nil
}
