package v1

import (
	"app/model/v1/internal/impl"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/astar"
)

type Model impl.Model

//ILobbyModel
func (v Model) BuyRobot(id string) (protocol.IModel, error) {
	model, err := impl.BuyRobot(impl.Model(v), id)
	return Model(model), err
}
func (v Model) BuyPilot(id string) (protocol.IModel, error) {
	model, err := impl.BuyPilot(impl.Model(v), id)
	return Model(model), err
}
func (v Model) BuyWeapon(id string) (protocol.IModel, error) {
	model, err := impl.BuyWeapon(impl.Model(v), id)
	return Model(model), err
}
func (v Model) BuyComponent(id string) (protocol.IModel, error) {
	model, err := impl.BuyComponent(impl.Model(v), id)
	return Model(model), err
}
func (v Model) AssocRobotPilot(robotID string, pilotID string) (protocol.IModel, error) {
	model, err := impl.AssocRobotPilot(impl.Model(v), robotID, pilotID)
	return Model(model), err
}
func (v Model) DissocRobotPilot(robotID string) (protocol.IModel, error) {
	model, err := impl.DissocRobotPilot(impl.Model(v), robotID)
	return Model(model), err
}
func (v Model) AssocWeaponRobot(weaponID string, robotID string) (protocol.IModel, error) {
	model, err := impl.AssocWeaponRobot(impl.Model(v), weaponID, robotID)
	return Model(model), err
}
func (v Model) DissocWeaponRobot(weaponID string) (protocol.IModel, error) {
	model, err := impl.DissocWeaponRobot(impl.Model(v), weaponID)
	return Model(model), err
}
func (v Model) AssocComponentRobot(componentID string, robotID string) (protocol.IModel, error) {
	model, err := impl.AssocComponentRobot(impl.Model(v), componentID, robotID)
	return Model(model), err
}
func (v Model) DissocComponentRobot(componentID string) (protocol.IModel, error) {
	model, err := impl.DissocComponentRobot(impl.Model(v), componentID)
	return Model(model), err
}

// IFlow
func (v Model) OnSingleBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (interface{}, bool, error) {
	return OnSingleBattleMenuPhase(origin.(uidata.UI), isPlayerTurn, robotID, weaponID, targetRobotID)
}
func (v Model) OnLineBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetPosition protocol.Position) (interface{}, bool, error) {
	return OnLineBattleMenuPhase(origin.(uidata.UI), isPlayerTurn, robotID, weaponID, targetPosition)
}
func (v Model) OnPlayerTurnStart(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnStart(ui.(uidata.UI), player)
}
func (v Model) OnPlayerTurnEnd(ui interface{}, player protocol.Player) (interface{}, error) {
	return OnPlayerTurnEnd(ui.(uidata.UI), player)
}
func (v Model) OnEnemyTurnPhase(origin interface{}) (interface{}, bool, error) {
	return EnemyTurnPhase(origin.(uidata.UI))
}
func (v Model) OnRobotTransform(ctx interface{}, robotID string, transform string) (interface{}, error) {
	return OnRobotTransform(ctx.(uidata.UI), robotID, transform)
}
func (v Model) OnRobotSkyGround(ctx interface{}, robotID string, sky bool) (interface{}, error) {
	return OnRobotSkyGround(ctx.(uidata.UI), robotID, sky)
}
func (v Model) OnRobotMove(ctx interface{}, robotID string, tree astar.NodeMap, pos protocol.Position) (interface{}, error) {
	return OnRobotMove(ctx.(uidata.UI), robotID, tree, pos)
}
func (v Model) OnRobotDone(ctx interface{}, robotID string) (interface{}, error) {
	return OnRobotDone(ctx.(uidata.UI), robotID)
}
func (v Model) OnEnableRobotMenu(ctx interface{}, robotID string) (interface{}, error) {
	return OnEnableRobotMenu(ctx.(uidata.UI), robotID)
}
func (v Model) OnDisableRobotMenu(ctx interface{}) (interface{}, error) {
	return OnDisableRobotMenu(ctx.(uidata.UI))
}
func (v Model) OnEnableBattleMenu(origin interface{}, robotID string, weaponID string, targetRobotID string) (interface{}, error) {
	return OnEnableBattleMenu(origin.(uidata.UI), robotID, weaponID, targetRobotID)
}
func (v Model) OnDisableBattleMenu(origin interface{}) (interface{}, error) {
	return OnDisableBattleMenu(origin.(uidata.UI))
}
func (v Model) OnClickSystemMenu(origin interface{}, selection string) (interface{}, error) {
	return OnClickSystemMenu(origin.(uidata.UI), selection)
}

// IGameplayModel
func (v Model) ObservePage(ui interface{}, id int) (interface{}, error) {
	return ObservePage(ui.(uidata.UI), id)
}
func (v Model) ObserveRobot(robot protocol.Robot) (protocol.Robot, error) {
	return impl.ObserveRobot(impl.Model(v), robot)
}
func (v Model) New(situation interface{}) (protocol.IModel, error) {
	model, err := impl.NewModel(impl.Model(v), situation)
	return Model(model), err
}
func (v Model) Save() error {
	return impl.Save(impl.Model(v))
}
func (v Model) Load() (protocol.IModel, error) {
	model, err := impl.Load(impl.Model(v))
	return Model(model), err
}
func (v Model) QueryActivePlayer() (protocol.Player, error) {
	return impl.QueryActivePlayer(impl.Model(v))
}
func (v Model) NextPlayer() (protocol.IModel, error) {
	model, err := impl.NextPlayer(impl.Model(v))
	return Model(model), err
}
func (v Model) IsDone() bool {
	return impl.IsDone(impl.Model(v))
}
func (v Model) QueryUnitsByRegion(p1 protocol.Position, p2 protocol.Position) []string {
	return impl.QueryUnitsByRegion(impl.Model(v), p1, p2)
}
func (v Model) QueryUnitByPosition(p1 protocol.Position) string {
	return impl.QueryUnitByPosition(impl.Model(v), p1)
}
func (v Model) SetMoveRange(moveRange []protocol.Position) protocol.IModel {
	model := impl.SetMoveRange(impl.Model(v), moveRange)
	return Model(model)
}
func (v Model) GetMoveRange() []protocol.Position {
	return impl.GetMoveRange(impl.Model(v))
}
func (v Model) QueryMoveRangeTree(robotID string) (astar.NodeMap, error) {
	return impl.QueryMoveRangeTree(impl.Model(v), robotID)
}
func (v Model) QueryMoveCount(robotID string) int {
	return impl.QueryMoveCount(impl.Model(v), robotID)
}
func (v Model) SetCursor(cursor protocol.Position) protocol.IModel {
	model := impl.SetCursor(impl.Model(v), cursor)
	return Model(model)
}
func (v Model) GetCursor() protocol.Position {
	return impl.GetCursor(impl.Model(v))
}
