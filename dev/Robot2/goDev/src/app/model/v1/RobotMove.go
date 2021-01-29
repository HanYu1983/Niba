package v1

import (
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func (v *model) RobotMove(robotID string, pos protocol.Position) error {
	tags := v.App.Gameplay.Tags[robotID]
	if tags.MoveCount >= 1 {
		return fmt.Errorf("[RobotMove] already move %v", robotID)
	}
	unitAtPos := SearchUnitByPosition(v.App.Gameplay.Positions, pos)
	var notFound string
	if unitAtPos != notFound {
		return fmt.Errorf("[RobotMove] already occupy %v", pos)
	}
	v.App.Gameplay.Positions = protocol.AssocStringPosition(v.App.Gameplay.Positions, robotID, pos)
	tags.MoveCount++
	v.App.Gameplay.Tags = protocol.AssocStringTag(v.App.Gameplay.Tags, robotID, tags)
	log.Log(protocol.LogCategoryInfo, "RobotMove", fmt.Sprintf("robotID(%v) tags(%v)\n", robotID, v.App.Gameplay.Tags[robotID]))
	return nil
}
