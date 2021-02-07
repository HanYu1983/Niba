package v1

import (
	"app/tool/data"
	"app/tool/protocol"
	"math"
)

func ObserveWeapon(model model, robot protocol.Robot, weapon protocol.Weapon) (protocol.Weapon, error) {
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.Title = weaponProto.Title
	weapon.Range, err = QueryRobotWeaponRange(model, robot, weapon)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.EnergyCost = weaponProto.EnergyCost
	weapon.MaxBulletCount = weaponProto.MaxBulletCount
	weapon.Suitablility = weaponProto.Suitablility
	weapon.Ability = weaponProto.Ability
	weapon.EnergyType = weaponProto.EnergyType
	weapon.Type = weaponProto.Type
	weapon.Accuracy = math.Floor(weaponProto.Accuracy*100) / 100
	weapon.Damage = weaponProto.Damage
	weapon.Curage = weaponProto.Curage
	weapon.UnlockExp = weaponProto.UnlockExp
	return weapon, nil
}
