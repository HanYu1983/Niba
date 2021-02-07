package v1

import (
	"app/tool/data"
	"app/tool/protocol"
)

func ObserveWeapon(model model, robot protocol.Robot, weapon protocol.Weapon) (protocol.Weapon, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.Title = weaponProto.Title
	weapon.Range, err = QueryRobotWeaponRange(model, robot.ID, robot.Transform, weapon)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.EnergyCost = weaponProto.EnergyCost
	weapon.MaxBulletCount = weaponProto.MaxBulletCount
	weapon.Suitablility = weaponProto.Suitablility
	weapon.Ability = weaponProto.Ability
	weapon.EnergyType = weaponProto.EnergyType
	weapon.Type = weaponProto.Type
	weapon.Accuracy = weaponProto.Accuracy
	weapon.Damage = weaponProto.Damage
	weapon.Curage = weaponProto.Curage
	weapon.UnlockExp = weaponProto.UnlockExp
	return weapon, nil
}
