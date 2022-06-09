package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"tool/log"
)

func ObserveWeapons(model types.Model, robotID string, origin map[string]protocol.Weapon, isGameplay bool) (map[string]protocol.Weapon, error) {
	log.Log(protocol.LogCategoryRender, "ObserveWeapons", "start")
	var err error
	ctx := origin
	for ID, weapon := range origin {
		ctx[ID], err = ObserveWeapon(model, robotID, weapon, isGameplay)
		if err != nil {
			return origin, err
		}
	}
	log.Log(protocol.LogCategoryRender, "ObserveWeapons", "end")
	return ctx, nil
}
