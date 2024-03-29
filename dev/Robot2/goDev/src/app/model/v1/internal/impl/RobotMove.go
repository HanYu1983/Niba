package impl

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func RobotMove(origin types.Model, robotID string, pos protocol.Position) (types.Model, error) {
	v := origin
	tags := v.App.Gameplay.Tags[robotID]
	if tags.MoveCount >= 5 {
		return origin, fmt.Errorf("[RobotMove] already move %v", robotID)
	}
	unitAtPos := common.SearchUnitByPosition(v.App.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos != notFound {
		return origin, fmt.Errorf("[RobotMove] already occupy %v", pos)
	}
	v.App.Gameplay.Positions = protocol.AssocStringPosition(v.App.Gameplay.Positions, robotID, pos)
	tags.MoveCount++
	v.App.Gameplay.Tags = protocol.AssocStringTag(v.App.Gameplay.Tags, robotID, tags)
	log.Log(protocol.LogCategoryInfo, "RobotMove", fmt.Sprintf("robotID(%v) tags(%v)\n", robotID, v.App.Gameplay.Tags[robotID]))
	return v, nil
}
