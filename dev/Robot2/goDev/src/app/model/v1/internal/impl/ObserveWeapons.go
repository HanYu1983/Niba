package impl

import "app/tool/protocol"

func ObserveWeapons(model Model, robot protocol.Robot, origin map[string]protocol.Weapon) (map[string]protocol.Weapon, error) {
	var err error
	ctx := origin
	for ID, weapon := range origin {
		ctx[ID], err = ObserveWeapon(model, robot, weapon)
		if err != nil {
			return origin, err
		}
	}
	return ctx, nil
}
