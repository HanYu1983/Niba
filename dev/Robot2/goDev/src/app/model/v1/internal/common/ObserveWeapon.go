package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"math"
	"tool/log"
)

func ObserveWeapon(model types.Model, robotID string, weapon protocol.Weapon, isGameplay bool) (protocol.Weapon, error) {
	log.Log(protocol.LogCategoryRender, "ObserveWeapon", "start")
	weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.Title = weaponProto.Title
	weapon.Range, err = QueryRobotWeaponRange(model, robotID, weapon, isGameplay)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.PowerCost = weaponProto.PowerCost
	weapon.EnergyCost = weaponProto.EnergyCost
	weapon.MaxBulletCount = weaponProto.MaxBulletCount
	weapon.Suitability, err = QueryRobotWeaponSuitability(model, robotID, weapon, isGameplay)
	if err != nil {
		return protocol.Weapon{}, err
	}
	weapon.Ability, err = QueryRobotWeaponAbility(model, robotID, weapon, isGameplay)
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
