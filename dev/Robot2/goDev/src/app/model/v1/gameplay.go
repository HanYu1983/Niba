package v1

import (
	"app/tool/protocol"
	"fmt"
	"tool/log"
)

func (v *model) QueryActivePlayer() string {
	return protocol.PlayerIDPlayer
}
func (v *model) NextPlayer() error {
	return nil
}
func (v *model) IsDone() bool {
	return false
}
func (v *model) QueryUnitsByRegion(p1 protocol.Position, p2 protocol.Position) []string {
	return SearchUnitByRegion(v.App.Gameplay.Positions, p1, p2)
}
func (v *model) QueryUnitByPosition(pos protocol.Position) string {
	return SearchUnitByPosition(v.App.Gameplay.Positions, pos)
}
func (v *model) GetGameplayRobots() map[string]protocol.Robot {
	return v.App.Gameplay.Robots
}
func (v *model) GetGameplayItems() map[string]protocol.Item {
	return v.App.Gameplay.Items
}
func (v *model) GetGameplayPositions() map[string]protocol.Position {
	return v.App.Gameplay.Positions
}
func (v *model) GetGameplayTags() map[string]protocol.Tag {
	return v.App.Gameplay.Tags
}
func (v *model) SetCursor(cursor protocol.Position) {
	v.App.Gameplay.Cursor = cursor
}
func (v *model) GetCursor() protocol.Position {
	return v.App.Gameplay.Cursor
}
func (v *model) GetMap() [][]int {
	return v.App.Gameplay.Map
}
func (v *model) QueryMoveCount(robotID string) int {
	log.Log(protocol.LogCategoryInfo, "QueryMoveCount", fmt.Sprintf("tags(%+v)\n", v.App.Gameplay.Tags[robotID]))
	return v.App.Gameplay.Tags[robotID].MoveCount
}

func (v *model) RobotDone(robotID string) error {
	tags := v.App.Gameplay.Tags[robotID]
	tags.IsDone = true
	v.App.Gameplay.Tags = protocol.AssocStringTag(v.App.Gameplay.Tags, robotID, tags)
	return nil
}

func (v *model) RobotTransform(string, string) error {
	return nil
}
func (v *model) RobotSkyGround(string) error {
	return nil
}
func (v *model) DisableRobotMenu() error {
	v.App.Gameplay.RobotMenu.Active = false
	return nil
}
func (v *model) GetRobotMenu() protocol.RobotMenu {
	return v.App.Gameplay.RobotMenu
}
