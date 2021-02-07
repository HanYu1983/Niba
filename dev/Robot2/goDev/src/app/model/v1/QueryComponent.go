package v1

// const (
// 	InstanceIDTypePending = iota
// 	InstanceIDTypeBuiltin
// 	InstanceIDTypeBuy
// )

// type ComponentInstanceID struct {
// 	Type    int
// 	IntID   int
// 	StrID   string
// 	RobotID string
// }

// type WeaponInstanceID struct {
// 	Type      int
// 	IntID     int
// 	StrID     string
// 	RobotID   string
// 	Transform string
// }

// func QueryComponent(model model, instanceID ComponentInstanceID) (protocol.Component, error) {
// 	switch instanceID.Type {
// 	case InstanceIDTypeBuiltin:
// 		id := instanceID.IntID
// 		robot, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, instanceID.RobotID)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, robot.ProtoID)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		componentProtoID, err := tool.TryGetString(robotProto.Components, id)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, componentProtoID)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		return protocol.Component{
// 			ID:        fmt.Sprintf("%v", instanceID.IntID),
// 			ProtoID:   componentProtoID,
// 			Title:     componentProto.Title,
// 			Value:     componentProto.Value,
// 			PowerCost: componentProto.PowerCost,
// 		}, nil
// 	case InstanceIDTypeBuy:
// 		id := instanceID.StrID
// 		component, err := protocol.TryGetStringComponent(model.App.Lobby.Components, id)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		componentProto, err := data.TryGetStringComponentProto(data.GameData.Component, component.ProtoID)
// 		if err != nil {
// 			return protocol.Component{}, err
// 		}
// 		return protocol.Component{
// 			ID:        id,
// 			ProtoID:   component.ProtoID,
// 			Title:     componentProto.Title,
// 			Value:     componentProto.Value,
// 			PowerCost: componentProto.PowerCost,
// 		}, nil
// 	default:
// 		return protocol.Component{}, fmt.Errorf("unknown instanceID(%v)", instanceID)
// 	}
// }
