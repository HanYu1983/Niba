package v1

// func (v *model) QueryActivePlayer() string {
// 	return QueryActivePlayer(*v)
// }
// func (v *model) NextPlayer() error {
// 	m, err := NextPlayer(*v)
// 	if err != nil {
// 		return err
// 	}
// 	*v = m
// 	return nil
// }
// func (v *model) IsDone() bool {
// 	return IsDone(*v)
// }
// func (v *model) QueryUnitsByRegion(p1 protocol.Position, p2 protocol.Position) []string {
// 	return QueryUnitsByRegion(*v, p1, p2)
// }
// func (v *model) QueryUnitByPosition(pos protocol.Position) string {
// 	return QueryUnitByPosition(*v, pos)
// }
// func (v *model) GetGameplayRobots() map[string]protocol.Robot {
// 	return GetGameplayRobots(*v)
// }
// func (v *model) GetGameplayItems() map[string]protocol.Item {
// 	return GetGameplayItems(*v)
// }
// func (v *model) GetGameplayPositions() map[string]protocol.Position {
// 	return GetGameplayPositions(*v)
// }
// func (v *model) GetGameplayTags() map[string]protocol.Tag {
// 	return GetGameplayTags(*v)
// }
// func (v *model) SetCursor(cursor protocol.Position) {
// 	m := SetCursor(*v, cursor)
// 	*v = m
// }
// func (v *model) GetCursor() protocol.Position {
// 	return GetCursor(*v)
// }
// func (v *model) GetMap() [][]int {
// 	return GetMap(*v)
// }
// func (v *model) QueryMoveCount(robotID string) int {
// 	return QueryMoveCount(*v, robotID)
// }

// func (v *model) RobotDone(robotID string) error {
// 	m, err := RobotDone(*v, robotID)
// 	if err != nil {
// 		return err
// 	}
// 	*v = m
// 	return nil
// }

// func (v *model) RobotTransform(robotID string, transformID string) error {
// 	m, err := RobotTransform(*v, robotID, transformID)
// 	if err != nil {
// 		return err
// 	}
// 	*v = m
// 	return nil
// }
// func (v *model) RobotSkyGround(robotID string) error {
// 	m, err := RobotSkyGround(*v, robotID)
// 	if err != nil {
// 		return err
// 	}
// 	*v = m
// 	return nil
// }
// func (v *model) DisableRobotMenu() error {
// 	m, err := DisableRobotMenu(*v)
// 	if err != nil {
// 		return err
// 	}
// 	*v = m
// 	return nil
// }
// func (v *model) GetRobotMenu() protocol.RobotMenu {
// 	return GetRobotMenu(*v)
// }
// func (v *model) SetMoveRange(moveRange []protocol.Position) {
// 	m := SetMoveRange(*v, moveRange)
// 	*v = m
// }
// func (v *model) GetMoveRange() []protocol.Position {
// 	return GetMoveRange(*v)
// }
