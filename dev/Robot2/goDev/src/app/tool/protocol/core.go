package protocol

import (
	"fmt"
)

var (
	ErrTerminate = fmt.Errorf("ErrTerminate")
)

var (
	LogCategoryPhase   = "LogCategoryPhase"
	LogCategoryDetail  = "LogCategoryDetail"
	LogCategoryRender  = "LogCategoryRender"
	LogCategoryInfo    = "LogCategoryInfo"
	LogCategoryWarning = "LogCategoryWarning"
)

type Weapons = map[string]Weapon
type WeaponsByTransform = map[string]Weapons
type Position [2]int

type Robot struct {
	ID                 string
	PlayerID           string
	ProtoID            string
	PilotID            string
	Transform          string
	HP                 int
	EN                 int
	WeaponsByTransform WeaponsByTransform
	Components         map[string]Component
	// 以下是顯示用, 不能修改
	Title       string
	MaxHP       int
	MaxEN       int
	Armor       int
	BeamArmor   int
	Cost        int
	Power       int
	Suitability [4]float64
	UnlockExp   int
}

type Item struct {
	ID      string
	ProtoID string
	// 以下是顯示用, 不能修改
	Title string
}

type Pilot struct {
	ID      string
	ProtoID string
	// 以下是顯示用, 不能修改
	Title    string
	Melee    float64
	Range    float64
	Evade    float64
	Guard    float64
	ExpMelee int
	ExpRange int
	ExpEvade int
	ExpGuard int
	Exp      int
}

type Weapon struct {
	ID          string
	ProtoID     string
	BulletCount int
	// 以下是顯示用, 不能修改
	Title          string
	Range          [2]int
	EnergyCost     int
	MaxBulletCount int
	Suitability    [4]float64
	Ability        []string
	EnergyType     string
	Type           string
	Accuracy       float64
	Damage         int
	Curage         int
	UnlockExp      int
}

type Component struct {
	ID      string
	ProtoID string
	// 以下是顯示用, 不能修改
	Title     string
	Desc      string
	Value     []string
	PowerCost int
	Action    string
}

const (
	PlayerIDPlayer = "PlayerIDPlayer"
)

type Player struct {
	ID      string
	GroupID string
}

type Tag struct {
	MoveCount int
	Sky       bool
	IsDone    bool
}

const (
	RobotMenuFunctionPending = iota
	RobotMenuFunctionWeapon
	RobotMenuFunctionTransform
)

type RobotMenu struct {
	Active             bool
	ActiveRobotID      string
	Options            [][]string
	RowFunctionMapping map[int]int
	Weapons            map[string]Weapon
	InvalidWeapons     map[string]string
	Transforms         map[string]Robot
}

const (
	BattleMenuActionPending = iota
	BattleMenuActionAttack
	BattleMenuActionGuard
	BattleMenuActionEvade
	BattleMenuActionCanNotMove
)

type BattleMenu struct {
	Active        bool
	AttackRobot   Robot
	AttackPilot   Pilot
	AttackWeapon  Weapon
	DeffenceRobot Robot
	DeffencePilot Pilot
}

const (
	BattleResultTypePending = iota
	BattleResultTypeAim
	BattleResultTypeWeapon
	BattleResultTypeGuard
	BattleResultTypeEvade
	BattleResultTypeDamage
	BattleResultTypeDie
)

type BattleAnimation struct {
	Type        int
	RobotBefore Robot
	RobotAfter  Robot
	Damage      int
	Positions   map[string]Position
	AimPosition [2]Position
}

type BattleResult struct {
	Animations []BattleAnimation
}

func (result BattleResult) MapPosition(mapF func(pos Position) Position) BattleResult {
	localAnims := []BattleAnimation{}
	for _, animation := range result.Animations {
		locals := map[string]Position{}
		for robotID, pos := range animation.Positions {
			locals[robotID] = mapF(pos)
		}
		animation.Positions = locals
		for i, pos := range animation.AimPosition {
			animation.AimPosition[i] = mapF(pos)
		}
		localAnims = append(localAnims, animation)
	}
	result.Animations = localAnims
	return result
}

func (result BattleResult) MapRobot(mapF func(pos Robot) Robot) BattleResult {
	localAnims := []BattleAnimation{}
	for _, animation := range result.Animations {
		animation.RobotBefore = mapF(animation.RobotBefore)
		animation.RobotAfter = mapF(animation.RobotAfter)
		localAnims = append(localAnims, animation)
	}
	result.Animations = localAnims
	return result
}

type HitMark struct {
	HitRate float64
	Rate    float64
}
