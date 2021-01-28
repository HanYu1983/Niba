package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"fmt"
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
	fmt.Printf("[QueryMoveCount]%+v", v.App.Gameplay.Tags[robotID])
	return v.App.Gameplay.Tags[robotID].MoveCount
}

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
	return nil
}
func (v *model) RobotTransform(string, string) error {
	return nil
}
func (v *model) RobotSkyGround(string) error {
	return nil
}
func (v *model) EnableRobotMenu(string, interface{}) error {
	v.App.Gameplay.RobotMenu.Active = true
	v.App.Gameplay.RobotMenu.Options = [][]string{{uidata.MenuOptionMove}, {"0", "1"}, {uidata.MenuOptionUnitDone}}
	v.App.Gameplay.RobotMenu.RowFunctionMapping = map[int]int{1: protocol.RobotMenuFunctionWeapon}
	v.App.Gameplay.RobotMenu.Weapons = map[string]protocol.Weapon{"0": {}, "1": {}}
	return nil
}
func (v *model) GetRobotMenu() protocol.RobotMenu {
	return v.App.Gameplay.RobotMenu
}
