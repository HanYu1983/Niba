package data

type Pilot struct {
	ID      string
	ProtoID string
}

type Weapon struct {
	ID      string
	ProtoID string
}

type Weapons = map[string]Weapon
type WeaponsByTransform = map[string]Weapons

type Robot struct {
	ID                 string
	ProtoID            string
	PilotID            string
	WeaponsByTransform WeaponsByTransform
	Transform          string
}

type Item struct {
	ID      string
	ProtoID string
}

type Position [2]int

type Lobby struct {
	SeqID             string
	Robots            map[string]Robot
	Pilots            map[string]Pilot
	Weapons           map[string]Weapon
	RobotIDByWeaponID map[string]string
	PilotIDByRobotID  map[string]string
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

type Gameplay struct {
	Players        map[string]Player
	ActivePlayerID string
	Camera         Position
	Cursor         Position
	SeqID          int
	Units          []string
	Positions      map[string]Position
	Robots         map[string]Robot
	Tags           map[string]Tag
	Items          map[string]Item
	Pilots         map[string]Pilot
	Done           interface{}
	Lobby          Lobby
}

type CommandKeyDown struct {
	KeyCode string
}

type Menu struct {
	Options     [][]string
	Cursor      [2]int
	WeaponID    int
	TransformID int
}

const (
	MenuOptionMove      = "MenuOptionMove"
	MenuOptionSkyGround = "MenuOptionSkyGround"
)

type BattleActionAttack struct {
	WeaponID string
	HitRate  float32
}

type BattleActionGuard struct{}
type BattleActionEvade struct{}

type BattleMenu struct {
	Robots       [2]Robot
	BattleAction [2]interface{}
}
