package v1

import (
	"app/model/v1/internal/common"
	"app/model/v1/internal/impl"
	"app/model/v1/internal/lobby"
	"app/model/v1/internal/tool/types"
	"app/tool/protocol"
	"app/tool/uidata"
	"tool/astar"
)

type Model types.Model

//ILobbyModel
func (v Model) BuyRobot(id string) (protocol.IModel, error) {
	model, err := lobby.BuyRobot(types.Model(v), id)
	return Model(model), err
}
func (v Model) BuyPilot(id string) (protocol.IModel, error) {
	model, err := lobby.BuyPilot(types.Model(v), id)
	return Model(model), err
}
func (v Model) BuyWeapon(id string) (protocol.IModel, error) {
	model, err := lobby.BuyWeapon(types.Model(v), id)
	return Model(model), err
}
func (v Model) BuyComponent(id string) (protocol.IModel, error) {
	model, err := lobby.BuyComponent(types.Model(v), id)
	return Model(model), err
}
func (v Model) AssocRobotPilot(robotID string, pilotID string) (protocol.IModel, error) {
	model, err := lobby.AssocRobotPilot(types.Model(v), robotID, pilotID)
	return Model(model), err
}
func (v Model) DissocRobotPilot(robotID string) (protocol.IModel, error) {
	model, err := lobby.DissocRobotPilot(types.Model(v), robotID)
	return Model(model), err
}
func (v Model) AssocWeaponRobot(weaponID string, robotID string) (protocol.IModel, error) {
	model, err := lobby.AssocWeaponRobot(types.Model(v), weaponID, robotID)
	return Model(model), err
}
func (v Model) DissocWeaponRobot(weaponID string) (protocol.IModel, error) {
	model, err := lobby.DissocWeaponRobot(types.Model(v), weaponID)
	return Model(model), err
}
func (v Model) AssocComponentRobot(componentID string, robotID string) (protocol.IModel, error) {
	model, err := lobby.AssocComponentRobot(types.Model(v), componentID, robotID)
	return Model(model), err
}
func (v Model) DissocComponentRobot(componentID string) (protocol.IModel, error) {
	model, err := lobby.DissocComponentRobot(types.Model(v), componentID)
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
	return OnEnemyTurnPhase(origin.(uidata.UI))
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
func (v Model) ObservePage(origin interface{}, id int) (interface{}, error) {
	return ObservePage(origin.(uidata.UI), id)
}
func (v Model) OnEventPlayerTurnPhase(origin interface{}, evt interface{}) (interface{}, error) {
	return OnEventPlayerTurnPhase(origin.(uidata.UI), evt)
}

// IGameplayModel

func (v Model) ObserveRobot(robot protocol.Robot) (protocol.Robot, error) {
	return common.ObserveRobot(types.Model(v), robot)
}
func (v Model) New(situation interface{}) (protocol.IModel, error) {
	model, err := impl.NewModel(types.Model(v), situation)
	return Model(model), err
}
func (v Model) Save() error {
	return impl.Save(types.Model(v))
}
func (v Model) Load() (protocol.IModel, error) {
	model, err := impl.Load(types.Model(v))
	return Model(model), err
}
func (v Model) QueryActivePlayer() (protocol.Player, error) {
	return impl.QueryActivePlayer(types.Model(v))
}
func (v Model) NextPlayer() (protocol.IModel, error) {
	model, err := impl.NextPlayer(types.Model(v))
	return Model(model), err
}
func (v Model) IsDone() bool {
	return impl.IsDone(types.Model(v))
}
func (v Model) QueryUnitsByRegion(p1 protocol.Position, p2 protocol.Position) []string {
	return impl.QueryUnitsByRegion(types.Model(v), p1, p2)
}
func (v Model) QueryUnitByPosition(p1 protocol.Position) string {
	return impl.QueryUnitByPosition(types.Model(v), p1)
}
func (v Model) SetMoveRange(moveRange []protocol.Position) protocol.IModel {
	model := impl.SetMoveRange(types.Model(v), moveRange)
	return Model(model)
}
func (v Model) GetMoveRange() []protocol.Position {
	return impl.GetMoveRange(types.Model(v))
}
func (v Model) QueryMoveRangeTree(robotID string) (astar.NodeMap, error) {
	return impl.QueryMoveRangeTree(types.Model(v), robotID)
}
func (v Model) QueryMoveCount(robotID string) int {
	return impl.QueryMoveCount(types.Model(v), robotID)
}
func (v Model) SetCursor(cursor protocol.Position) protocol.IModel {
	model := impl.SetCursor(types.Model(v), cursor)
	return Model(model)
}
func (v Model) GetCursor() protocol.Position {
	return impl.GetCursor(types.Model(v))
}
