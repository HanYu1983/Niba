package data

import (
	"encoding/json"
	"fmt"
)

type RobotProto struct {
	Title       string
	Cost        int
	Power       int
	Weapons     []string
	Components  []string
	Suitability [4]float32
	Transform   []string
	UnlockExp   int
}

type PilotProto struct {
	Title    string
	Cost     int
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

type WeaponProto struct {
	Title          string
	Cost           int
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
	PowerCost      int
	UnlockExp      int
}

type ComponentProto struct {
	Title     string
	Cost      int
	Desc      string
	Value     []string
	PowerCost int
	Action    string
}

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

type Lobby struct {
	Robots               map[string]Robot
	Pilots               map[string]Pilot
	Weapons              map[string]Weapon
	Components           map[string]Component
	RobotIDByWeaponID    map[string]string
	RobotIDByComponentID map[string]string
	PilotIDByRobotID     map[string]string
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

type Menu struct {
	Active      bool
	Options     [][]string
	Cursor1     int
	Cursor2     []int
	WeaponID    int
	TransformID int
	UnitID      string
}

const (
	MenuOptionMove      = "MenuOptionMove"
	MenuOptionSkyGround = "MenuOptionSkyGround"
)

type BattleActionAttack struct {
	WeaponID string
}

type BattleActionGuard struct{}
type BattleActionEvade struct{}

type BattleMenuState struct {
	Active         bool
	AttackAction   interface{}
	DeffenceAction interface{}
}

type GameplayTag struct {
}

type Gameplay struct {
	Players         map[string]Player
	ActivePlayerID  string
	Camera          Position
	Cursor          Position
	SeqID           int
	Units           []string
	Positions       map[string]Position
	Robots          map[string]Robot
	Tags            map[string]Tag
	Items           map[string]Item
	Pilots          map[string]Pilot
	MenuStack       []Menu
	BattleMenuState BattleMenuState
	Done            interface{}
	Lobby           Lobby
}

type BattleInfo struct {
	HitRate float32
}

type BattleMenu struct {
	Active       bool
	Robots       [2]Robot
	BattleAction [2]interface{}
	BattleInfo   [2]BattleInfo
}

type App struct {
	SeqID    int
	Money    int
	Gameplay Gameplay
	Lobby    Lobby
}

var (
	DefaultApp = App{
		Money: 100000,
	}
)

type Data struct {
	Robot     map[string]RobotProto
	Pilot     map[string]PilotProto
	Weapon    map[string]WeaponProto
	Component map[string]ComponentProto
}

var (
	GameData Data
)

func init() {
	err := json.Unmarshal([]byte(dataJsonString), &GameData)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Printf("%+v\n", GameData)
}
