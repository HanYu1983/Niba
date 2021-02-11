package protocol

import "tool/astar"

type IFlow interface {
	OnPlayerTurnStart(ctx interface{}, player Player) (interface{}, error)
	OnPlayerTurnEnd(ctx interface{}, player Player) (interface{}, error)
	OnRobotBattle(ctx interface{}, robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (interface{}, error)
	OnEnemyTurnPhase(ctx interface{}) (interface{}, bool, error)
	OnRobotTransform(ctx interface{}, robotID string, transform string) (interface{}, error)
	OnRobotSkyGround(ctx interface{}, robotID string, sky bool) (interface{}, error)
	OnRobotMove(ctx interface{}, robotID string, tree astar.NodeMap, pos Position) (interface{}, error)
	OnRobotDone(ctx interface{}, robotID string) (interface{}, error)
	OnCreateRobotMenu(ctx interface{}, robotID string) (interface{}, error)
}
