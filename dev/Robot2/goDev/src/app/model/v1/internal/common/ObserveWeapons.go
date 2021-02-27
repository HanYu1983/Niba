package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"tool/log"
)

func ObserveWeapons(model types.Model, robot protocol.Robot, origin map[string]protocol.Weapon) (map[string]protocol.Weapon, error) {
	log.Log(protocol.LogCategoryRender, "ObserveWeapons", "start")
	var err error
	ctx := origin
	for ID, weapon := range origin {
		ctx[ID], err = ObserveWeapon(model, robot, weapon)
		if err != nil {
			return origin, err
		}
	}
	log.Log(protocol.LogCategoryRender, "ObserveWeapons", "end")
	return ctx, nil
}
