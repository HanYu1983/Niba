package protocol

import "tool/astar"

type IFlow interface {
	OnPlayerTurnStart(origin interface{}, player Player) (interface{}, error)
	OnPlayerTurnEnd(origin interface{}, player Player) (interface{}, error)
	OnSingleBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetRobotID string) (interface{}, bool, error)
	OnLineBattleMenuPhase(origin interface{}, isPlayerTurn bool, robotID string, weaponID string, targetPosition Position) (interface{}, bool, error)
	OnEnemyTurnPhase(origin interface{}) (interface{}, bool, error)
	OnRobotTransform(origin interface{}, robotID string, transform string) (interface{}, error)
	OnRobotSkyGround(origin interface{}, robotID string, sky bool) (interface{}, error)
	OnRobotMove(origin interface{}, robotID string, tree astar.NodeMap, pos Position) (interface{}, error)
	OnRobotDone(origin interface{}, robotID string) (interface{}, error)
	OnEnableRobotMenu(origin interface{}, robotID string) (interface{}, error)
	OnDisableRobotMenu(origin interface{}) (interface{}, error)
	OnEnableBattleMenu(origin interface{}, robotID string, weaponID string, targetRobotID string) (interface{}, error)
	OnDisableBattleMenu(origin interface{}) (interface{}, error)
}
