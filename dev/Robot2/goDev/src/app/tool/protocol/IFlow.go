package protocol

type IFlow interface {
	OnPlayerTurnStart(ctx interface{}, player Player) (interface{}, error)
	OnPlayerTurnEnd(ctx interface{}, player Player) (interface{}, error)
	OnRobotBattle(ctx interface{}, robotID string, weaponID string, targetRobotID string, targetAction int, targetRobotWeaponID string) (interface{}, error)
	OnEnemyTurnPhase(ctx interface{}) (interface{}, bool, error)
	OnRobotTransform(ctx interface{}, robotID string, transform string) (interface{}, error)
}
