package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"math"
	"tool/log"
)

func ObserveWeapon(model types.Model, robot protocol.Robot, weapon protocol.Weapon) (protocol.Weapon, error) {
	log.Log(protocol.LogCategoryRender, "ObserveWeapon", "start")
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
	weapon.Suitability, err = QueryRobotWeaponSuitability(model, robot, weapon)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.Ability, err = QueryRobotWeaponAbility(model, robot, weapon)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.EnergyType = weaponProto.EnergyType
	weapon.Type = weaponProto.Type
	weapon.Accuracy = math.Floor(weaponProto.Accuracy*100) / 100
	weapon.Damage = weaponProto.Damage
	weapon.Curage = weaponProto.Curage
	weapon.UnlockExp = weaponProto.UnlockExp
	log.Log(protocol.LogCategoryRender, "ObserveWeapon", "end")
	return weapon, nil
}
