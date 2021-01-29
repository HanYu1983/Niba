package protocol

import "fmt"

var (
	ErrTerminate = fmt.Errorf("ErrTerminate")
)

var (
	LogCategoryPhase   = "LogCategoryPhase"
	LogCategoryDetail  = "LogCategoryDetail"
	LogCategoryInfo    = "LogCategoryInfo"
	LogCategoryWarning = "LogCategoryWarning"
)

type Weapons = map[string]Weapon
type WeaponsByTransform = map[string]Weapons
type Position [2]int

type Robot struct {
	ID                 string
	ProtoID            string
	Title              string
	PilotID            string
	WeaponsByTransform WeaponsByTransform
	Transform          string
	PlayerID           string
	HP                 int
	EN                 int
	MaxHP              int
	MaxEN              int
	Cost               int
	Power              int
	Weapons            []string
	Components         []string
	Suitability        [4]float32
	UnlockExp          int
}

type Item struct {
	ID      string
	ProtoID string
	Title   string
}

type Pilot struct {
	ID       string
	ProtoID  string
	Title    string
	Melee    float32
	Range    float32
	Evade    float32
	Guard    float32
	ExpMelee int
	ExpRange int
	ExpEvade int
	ExpGuard int
	Exp      int
}

type Weapon struct {
	ID             string
	ProtoID        string
	Title          string
	Range          [2]int
	EnergyCost     int
	MaxBulletCount int
	Suitablility   [4]float32
	Ability        []string
	EnergyType     string
	Type           string
	Accuracy       float32
	Damage         int
	Curage         int
	UnlockExp      int
}

type Component struct {
	ID        string
	ProtoID   string
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
	Options            [][]string
	RowFunctionMapping map[int]int
	Weapons            map[string]Weapon
	Transforms         map[string]Robot
}
