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

// IFlow
func (v model) OnSingleBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (interface{}, bool, error) {
	return OnSingleBattleMenuPhase(origin.(uidata.UI), isPlayerTurn, robotID, weaponID, targetRobotID)
}
func (v model) OnLineBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetPosition protocol.Position) (interface{}, bool, error) {
	return OnLineBattleMenuPhase(origin.(uidata.UI), isPlayerTurn, robotID, weaponID, targetPosition)
}
func (v model) OnPlayerTurnStart(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnStart(ui.(uidata.UI), player)
}
func (v model) OnPlayerTurnEnd(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnEnd(ui.(uidata.UI), player)
}
func (v model) OnEnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	return EnemyTurnPhase(origin.(uidata.UI))
}
func (v model) OnRobotTransform(ctx interface{}, robotID string, transform string) (interface{}, error) {
	return OnRobotTransform(ctx.(uidata.UI), robotID, transform)
}
func (v model) OnRobotSkyGround(ctx interface{}, robotID string, sky bool) (interface{}, error) {
	return OnRobotSkyGround(ctx.(uidata.UI), robotID, sky)
}
func (v model) OnRobotMove(ctx interface{}, robotID string, tree astar.NodeMap, pos protocol.Position) (interface{}, error) {
	return OnRobotMove(ctx.(uidata.UI), robotID, tree, pos)
}
func (v model) OnRobotDone(ctx interface{}, robotID string) (interface{}, error) {
	return OnRobotDone(ctx.(uidata.UI), robotID)
}
func (v model) OnEnableRobotMenu(ctx interface{}, robotID string) (interface{}, error) {
	return OnEnableRobotMenu(ctx.(uidata.UI), robotID)
}
func (v model) OnDisableRobotMenu(ctx interface{}) (interface{}, error) {
	return OnDisableRobotMenu(ctx.(uidata.UI))
}
func (v model) OnEnableBattleMenu(origin interface{}, robotID string, weaponID string, targetRobotID string) (interface{}, error) {
	return OnEnableBattleMenu(origin.(uidata.UI), robotID, weaponID, targetRobotID)
}
func (v model) OnDisableBattleMenu(origin interface{}) (interface{}, error) {
	return OnDisableBattleMenu(origin.(uidata.UI))
}
func (v model) OnClickSystemMenu(origin interface{}, selection string) (interface{}, error) {
	return OnClickSystemMenu(origin.(uidata.UI), selection)
}

// IGameplayModel
func (v model) ObservePage(ui interface{}, id int) (interface{}, error) {
	return ObservePage(ui.(uidata.UI), id)
}
func (v model) ObserveRobot(robot protocol.Robot) (protocol.Robot, error) {
	return ObserveRobot(v, robot)
}
func (v model) New(situation interface{}) (protocol.IModel, error) {
	return NewModel(v, situation)
}
func (v model) Save() error {
	return Save(v)
}
func (v model) Load() (protocol.IModel, error) {
	return Load(v)
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
