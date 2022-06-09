package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"tool/log"
)

func ObserveComponents(model types.Model, robotID string, origin map[string]protocol.Component, isGameplay bool) (map[string]protocol.Component, error) {
	log.Log(protocol.LogCategoryRender, "ObserveComponents", "start")
	var err error
	ctx := origin
	for ID, weapon := range origin {
		ctx[ID], err = ObserveComponent(model, robotID, weapon, isGameplay)
		if err != nil {
			return origin, err
		}
	}
	log.Log(protocol.LogCategoryRender, "ObserveComponents", "end")
	return ctx, nil
}
