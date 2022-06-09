package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
)

func QueryRobotCombatPower(model types.Model, robot protocol.Robot, weapons protocol.Weapons) (int, error) {
	var enCombatPower int
	var enCombatCost int
	var bulletCombatPower int
	for _, weapon := range weapons {
		weaponProto, err := data.TryGetStringWeaponProto(data.GameData.Weapon, weapon.ProtoID)
		if err != nil {
			return 0, nil
		}
		switch weaponProto.EnergyType {
		case "energy":
			enCombatPower += weaponProto.Damage
			enCombatCost += weaponProto.EnergyCost
		case "bullet":
			bulletCombatPower += weaponProto.Damage * weapon.BulletCount
		}
	}
	total := robot.HP + bulletCombatPower + int(float64(enCombatPower)*float64(robot.EN)/float64(enCombatCost))
	return total, nil
}
