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
	PlayerID           string
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

const (
	PageStart = iota
	PageGameplay
	PageLobby
)

type App struct {
	Page     int
	Gameplay Gameplay
	Lobby    Lobby
}
