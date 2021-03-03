package common

import (
	"app/model/v1/internal/tool/types"
	"app/tool/data"
	"app/tool/protocol"
	"tool/log"
)

func ObserveComponent(model types.Model, robotID string, weapon protocol.Component, isGameplay bool) (protocol.Component, error) {
	log.Log(protocol.LogCategoryRender, "ObserveComponent", "start")
	weaponProto, err := data.TryGetStringComponentProto(data.GameData.Component, weapon.ProtoID)
	if err != nil {
		return protocol.Component{}, err
	}
	weapon.Title = weaponProto.Title
	weapon.Value = weaponProto.Value
	weapon.PowerCost = weaponProto.PowerCost
	weapon.Cost = weaponProto.Cost
	weapon.Desc = weaponProto.Desc
	weapon.Title = weaponProto.Title
	weapon.Action = weaponProto.Action
	log.Log(protocol.LogCategoryRender, "ObserveComponent", "end")
	return weapon, nil
}
