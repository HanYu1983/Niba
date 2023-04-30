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

type IReaction interface{}

type RobotAttackPreview struct {
	HitRate  float32
	Reaction IReaction
}

type ReactionShieldBlock struct {
	Shield Weapon
	Rate   float32
}

type ReactionSwordBlock struct {
	Sword Weapon
	Rate  float32
}

type ReactionEvade struct {
	Rate float32
}

type BattleComponent interface{}
