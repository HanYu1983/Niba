package combat

type Weapon interface {
	GetBlockingRate(env interface{}) float32
}

type CombatStyle interface {
}

type SwordShieldCombatStyle struct {
	Sword  Weapon
	Shield Weapon
}

type SwordSwordCombatStyle struct {
	Swords []Weapon
}

type Robot interface {
	GetCombatStyle(env interface{}) CombatStyle
}

type RobotAttackResult interface{}

type BattleComponent interface{}
