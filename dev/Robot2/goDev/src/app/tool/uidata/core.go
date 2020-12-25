package uidata

import (
	"app/tool/data"
)

// is
const (
	KeyCodeUp         = 87
	KeyCodeDown       = 83
	KeyCodeLeft       = 65
	KeyCodeRight      = 68
	KeyCodeEnter      = 13
	KeyCodeCancel     = 222 // '
	KeyCodeL          = 81
	KeyCodeR          = 69
	KeyCodeArrowUp    = 38
	KeyCodeArrowDown  = 40
	KeyCodeArrowLeft  = 37
	KeyCodeArrowRight = 39
	KeyCodeSpace      = 32
	KeyCodeTab        = 186 // ;
)

// CommandKeyDown is
type CommandKeyDown struct {
	KeyCode int
}

// CommandKeyUp is
type CommandKeyUp struct {
	KeyCode int
}

// CommandFlush is
type CommandFlush struct {
}

// Menu1D is
type Menu1D struct {
	Options []string
	Cursor  int
	Offset  int
	Limit   int
	Info    struct {
		Options []string
		Cursor  int
		Offset  int
		Limit   int
	}
}

// Menu2D is
type Menu2D struct {
	Options [][]string
	Cursor1 int
	Cursor2 []int
	Info    struct {
		Options [][]string
		Cursor1 int
		Cursor2 []int
	}
}

//
const (
	BattleActionAttack = iota
	BattleActionGuard
	BattleActionEvade
)

// BattleMenuSlot is
type BattleMenuSlot struct {
	Robot        data.Robot
	BattleAction int
	Weapon       data.Weapon
	Info         struct {
		HitRate float32
	}
}

// BattleMenu is
type BattleMenu struct {
	Left  BattleMenuSlot
	Right BattleMenuSlot
}

// GameplayPage is
type GameplayPage struct {
	Active     bool
	Map        [][]int
	Cursor     data.Position
	Units      []string
	UnitMenu   Menu2D
	BattleMenu BattleMenu
	Robots     map[string]data.Robot
	Items      map[string]data.Item
	Positions  map[string]data.Position
}

//
const (
	PageStart = iota
	PageLobby
	PageBuyRobot
	PageBuyPilot
	PageBuyWeapon
	PageBuyComponent
	PageGameplay
)

// ListInt is
type ListInt []int

// UI is
type UI struct {
	Actives       map[int]bool
	Menus         map[int]ListInt
	Focus         map[int]int
	Menu1Ds       map[int]Menu1D
	Menu2Ds       map[int]Menu2D
	GameplayPages map[int]GameplayPage
	Info          struct {
		Money            int
		CanBuyRobots     map[string]data.RobotProto
		CanBuyPilots     map[string]data.PilotProto
		CanBuyWeapons    map[string]data.WeaponProto
		CanBuyComponents map[string]data.ComponentProto
		Robots           map[string]data.Robot
		Pilots           map[string]data.Pilot
		Weapons          map[string]data.Weapon
		Components       map[string]data.Component
	}
}

//
const (
	MenuOptionNewGame       = "MenuOptionNewGame"
	MenuOptionLoadGame      = "MenuOptionLoadGame"
	MenuOptionStartGameplay = "MenuOptionStartGameplay"

	MenuOptionBuyRobot     = "MenuOptionBuyRobot"
	MenuOptionBuyPilot     = "MenuOptionBuyPilot"
	MenuOptionBuyWeapon    = "MenuOptionBuyWeapon"
	MenuOptionBuyComponent = "MenuOptionBuyComponent"

	MenuOptionCreateNew = "MenuOptionCreateNew"
	MenuOptionSell      = "MenuOptionSell"
)

//
const (
	Menu1DStartMenu = iota
	Menu1DLobbyMenu
	Menu1DRobotListMenu
	Menu1DPilotListMenu
	Menu1DWeaponListMenu
	Menu1DComponentListMenu
	Menu1DBuyRobotMenu
	Menu1DBuyPilotMenu
	Menu1DBuyWeaponMenu
	Menu1DBuyComponentMenu
	Menu1DBuyOrSellOrElseMenu
	Menu2DUnitMenu
)

//
var (
	DefaultUI = UI{
		Menus: map[int]ListInt{
			PageStart: []int{
				Menu1DStartMenu,
			},
			PageLobby: []int{
				Menu1DLobbyMenu,
			},
			PageBuyRobot: []int{
				Menu1DRobotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyRobotMenu,
			},
			PageBuyPilot: []int{
				Menu1DPilotListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyPilotMenu,
			},
			PageBuyWeapon: []int{
				Menu1DWeaponListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyWeaponMenu,
			},
			PageBuyComponent: []int{
				Menu1DComponentListMenu, Menu1DBuyOrSellOrElseMenu, Menu1DBuyComponentMenu,
			},
		},
		Focus: map[int]int{},
		Menu1Ds: map[int]Menu1D{
			Menu1DStartMenu: {
				Options: []string{
					MenuOptionNewGame, MenuOptionLoadGame,
				},
				Limit: 10,
			},
			Menu1DLobbyMenu: {
				Options: []string{
					MenuOptionBuyRobot, MenuOptionBuyPilot, MenuOptionBuyWeapon, MenuOptionBuyComponent, MenuOptionStartGameplay,
				},
				Limit: 10,
			},
			Menu1DBuyOrSellOrElseMenu: {
				Options: []string{
					MenuOptionCreateNew, MenuOptionSell,
				},
				Limit: 10,
			},
		},
		Menu2Ds: map[int]Menu2D{
			Menu2DUnitMenu: {},
		},
		GameplayPages: map[int]GameplayPage{
			PageGameplay: GameplayPage{
				Active: true,
				Map: [][]int{
					{0, 1, 2, 3, 4},
				},
				Cursor: data.Position{1, 1},
				Units: []string{
					"",
				},
				UnitMenu: Menu2D{
					Options: [][]string{
						{"move"},
						{"weapon1", "weapon2"},
					},
				},
				BattleMenu: BattleMenu{
					Left: BattleMenuSlot{
						BattleAction: BattleActionAttack,
					},
					Right: BattleMenuSlot{
						BattleAction: BattleActionAttack,
					},
				},
				Robots: map[string]data.Robot{},
				Items:  map[string]data.Item{},
			},
		},
	}
)
