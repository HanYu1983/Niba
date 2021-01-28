package protocol

import "fmt"

var (
	ErrTerminate = fmt.Errorf("ErrTerminate")
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
}

type Item struct {
	ID      string
	ProtoID string
	Title   string
}

type Pilot struct {
	ID      string
	ProtoID string
	Title   string
}

type Weapon struct {
	ID      string
	ProtoID string
	Title   string
}

type Component struct {
	ID      string
	ProtoID string
	Title   string
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
