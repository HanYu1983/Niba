package v1

// func QueryWeapon(model model, instanceID WeaponInstanceID) (protocol.Weapon, error) {
// 	switch instanceID.Type {
// 	case InstanceIDTypeBuiltin:
// 		id := instanceID.IntID
// 		_, err := protocol.TryGetStringRobot(model.App.Gameplay.Robots, instanceID.RobotID)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		robotProto, err := data.TryGetStringRobotProto(data.GameData.Robot, instanceID.Transform)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		weaponProtoID, err := tool.TryGetString(robotProto.Weapons, id)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weaponProtoID)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		return protocol.Weapon{
// 			ID:             fmt.Sprintf("%v", instanceID.IntID),
// 			ProtoID:        weaponProtoID,
// 			Title:          weaponProto.Title,
// 			Range:          weaponProto.Range,
// 			EnergyCost:     weaponProto.EnergyCost,
// 			MaxBulletCount: weaponProto.MaxBulletCount,
// 			Suitablility:   weaponProto.Suitablility,
// 			Ability:        weaponProto.Ability,
// 			EnergyType:     weaponProto.EnergyType,
// 			Type:           weaponProto.Type,
// 			Accuracy:       weaponProto.Accuracy,
// 			Damage:         weaponProto.Damage,
// 			Curage:         weaponProto.Curage,
// 			UnlockExp:      weaponProto.UnlockExp,
// 		}, nil
// 	case InstanceIDTypeBuy:
// 		id := instanceID.StrID
// 		weapon, err := protocol.TryGetStringWeapon(model.App.Lobby.Weapons, id)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
// 		if err != nil {
// 			return protocol.Weapon{}, err
// 		}
// 		return protocol.Weapon{
// 			ID:             id,
// 			ProtoID:        weapon.ProtoID,
// 			Title:          weaponProto.Title,
// 			Range:          weaponProto.Range,
// 			EnergyCost:     weaponProto.EnergyCost,
// 			MaxBulletCount: weaponProto.MaxBulletCount,
// 			Suitablility:   weaponProto.Suitablility,
// 			Ability:        weaponProto.Ability,
// 			EnergyType:     weaponProto.EnergyType,
// 			Type:           weaponProto.Type,
// 			Accuracy:       weaponProto.Accuracy,
// 			Damage:         weaponProto.Damage,
// 			Curage:         weaponProto.Curage,
// 			UnlockExp:      weaponProto.UnlockExp,
// 		}, nil
// 	default:
// 		return protocol.Weapon{}, fmt.Errorf("unknown instanceID(%v)", instanceID)
// 	}
// }
