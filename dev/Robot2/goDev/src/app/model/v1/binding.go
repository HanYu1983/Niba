package v1

import (
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/astar"
)

//ILobbyModel
func (v model) BuyRobot(id string) (protocol.IModel, error) {
	return BuyRobot(v, id)
}
func (v model) BuyPilot(id string) (protocol.IModel, error) {
	return BuyPilot(v, id)
}
func (v model) BuyWeapon(id string) (protocol.IModel, error) {
	return BuyWeapon(v, id)
}
func (v model) BuyComponent(id string) (protocol.IModel, error) {
	return BuyComponent(v, id)
}
func (v model) AssocRobotPilot(robotID string, pilotID string) (protocol.IModel, error) {
	return AssocRobotPilot(v, robotID, pilotID)
}
func (v model) DissocRobotPilot(robotID string) (protocol.IModel, error) {
	return DissocRobotPilot(v, robotID)
}
func (v model) AssocWeaponRobot(weaponID string, robotID string) (protocol.IModel, error) {
	return AssocWeaponRobot(v, weaponID, robotID)
}
func (v model) DissocWeaponRobot(weaponID string) (protocol.IModel, error) {
	return DissocWeaponRobot(v, weaponID)
}
func (v model) AssocComponentRobot(componentID string, robotID string) (protocol.IModel, error) {
	return AssocComponentRobot(v, componentID, robotID)
}
func (v model) DissocComponentRobot(componentID string) (protocol.IModel, error) {
	return DissocComponentRobot(v, componentID)
}

// IGameplayModel
func (v model) OnPlayerTurnStart(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnStart(ui.(uidata.UI), player)
}
func (v model) OnPlayerTurnEnd(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnEnd(ui.(uidata.UI), player)
}
func (v model) ObservePage(ui interface{}, id int) (interface{}, error) {
	return ObservePage(ui.(uidata.UI), id)
}
func (v model) EnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	return EnemyTurnPhase(origin.(uidata.UI))
}
func (v model) QueryActivePlayer() (protocol.Player, error) {
	return QueryActivePlayer(v)
}
func (v model) NextPlayer() (protocol.IModel, error) {
	return NextPlayer(v)
}
func (v model) IsDone() bool {
	return IsDone(v)
}
func (v model) QueryUnitsByRegion(p1 protocol.Position, p2 protocol.Position) []string {
	return QueryUnitsByRegion(v, p1, p2)
}
func (v model) QueryUnitByPosition(p1 protocol.Position) string {
	return QueryUnitByPosition(v, p1)
}
func (v model) SetMoveRange(moveRange []protocol.Position) protocol.IModel {
	return SetMoveRange(v, moveRange)
}
func (v model) GetMoveRange() []protocol.Position {
	return GetMoveRange(v)
}
func (v model) QueryMoveRangeTree(robotID string) (astar.NodeMap, error) {
	return QueryMoveRangeTree(v, robotID)
}
func (v model) QueryMoveCount(robotID string) int {
	return QueryMoveCount(v, robotID)
}
func (v model) SetCursor(cursor protocol.Position) protocol.IModel {
	return SetCursor(v, cursor)
}
func (v model) GetCursor() protocol.Position {
	return GetCursor(v)
}
func (v model) RobotDone(robotID string) (protocol.IModel, error) {
	return RobotDone(v, robotID)
}
func (v model) RobotMove(robotID string, pos protocol.Position) (protocol.IModel, error) {
	return RobotMove(v, robotID, pos)
}
func (v model) RobotTransform(robotID string, transformID string) (protocol.IModel, error) {
	return RobotTransform(v, robotID, transformID)
}
func (v model) RobotSkyGround(robotID string) (protocol.IModel, error) {
	return RobotSkyGround(v, robotID)
}
func (v model) EnableRobotMenu(robotID string, situation interface{}) (protocol.IModel, error) {
	return EnableRobotMenu(v, robotID, situation)
}
func (v model) DisableRobotMenu() (protocol.IModel, error) {
	return DisableRobotMenu(v)
}
func (v model) EnableBattleMenu(robotID string, weaponID string, targetRobotID string) (protocol.IModel, error) {
	return EnableBattleMenu(v, robotID, weaponID, targetRobotID)
}
func (v model) DisableBattleMenu() (protocol.IModel, error) {
	return DisableBattleMenu(v)
}
func (v model) Battle(robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (protocol.IModel, protocol.BattleResult, error) {
	return Battle(v, robotID, weaponID, targetRobotID, targetAction, targetRobotWeaponID)
}
